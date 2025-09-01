import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import PrimaryButton from '../components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { Meal } from '../types';

export default function ScanScreen({ navigation }: any) {
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const [frozenUri, setFrozenUri] = useState<string | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try { await requestCameraPermission(); } catch {}
    })();
  }, []);

  // Unfreeze the preview whenever the screen regains focus
  useEffect(() => {
    if (isFocused) setFrozenUri(null);
  }, [isFocused]);

  async function ensurePermissions(kind: 'camera' | 'library') {
    if (kind === 'library') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission to access gallery was denied');
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission to access camera was denied');
    }
  }

  async function handlePickFromLibrary() {
    try {
      await ensurePermissions('library');
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      await uploadAndAnalyze(asset.uri);
    } catch (e: any) {
      Alert.alert('Gallery Error', e.message || 'Could not pick image');
    }
  }

  async function handleTakePhoto() {
    try {
      await ensurePermissions('camera');
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      await uploadAndAnalyze(asset.uri);
    } catch (e: any) {
      Alert.alert('Camera Error', e.message || 'Could not take photo');
    }
  }

  async function handleSnapFromPreview() {
    try {
      // Prefer live camera preview capture; fallback to system camera if not available
      // @ts-ignore - method name varies by version; we guard with optional chaining
      const photo = await cameraRef.current?.takePictureAsync?.({ quality: 0.8, skipProcessing: true })
        || await (cameraRef.current as any)?.takePhoto?.({ quality: 0.8 });
      if (photo?.uri) {
        setFrozenUri(photo.uri);
        await uploadAndAnalyze(photo.uri);
      } else {
        await handleTakePhoto();
      }
    } catch (e: any) {
      await handleTakePhoto();
    }
  }

  async function uploadAndAnalyze(uri: string) {
    try {
      setUploading(true);
      // Re-encode to JPEG to handle iOS HEIC/HEIF
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      const fileUri = manipulated.uri;
      const filename = fileUri.split('/').pop() || `photo-${Date.now()}.jpg`;
      const type = 'image/jpeg';
      const form = new FormData();
      (form as any).append('image', ({ uri: fileUri, name: filename, type } as unknown) as any);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const response = await fetch('http://192.168.1.130:8000/analyze', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form as any,
        signal: controller.signal as any,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error (${response.status}): ${text}`);
      }
      const json = await response.json();
      const meal = transformAnalyzeResponse(json, fileUri);
      navigation.navigate('Results', { meal });
    } catch (e: any) {
      Alert.alert('Analyze Failed', e.message || 'Unable to analyze image');
    } finally {
      setUploading(false);
    }
  }

  function transformAnalyzeResponse(payload: any, photoUri?: string): Meal {
    const items = (payload?.items || []).map((it: any, idx: number) => ({
      id: `it-${idx}`,
      name: String(it?.name || 'Item'),
      quantity: it?.quantity ? `${it.quantity.value} ${it.quantity.unit}` : undefined,
      calories: Number(it?.macros?.calories || 0),
      macros: {
        protein: Number(it?.macros?.protein_g || 0),
        carbs: Number(it?.macros?.carbs_g || 0),
        fat: Number(it?.macros?.fats_g || 0),
        fiber: Number(it?.macros?.fiber_g || 0),
        sugar: Number(it?.macros?.sugar_g || 0),
        sodium: Number(it?.macros?.sodium_mg || 0),
      },
    }));

    const totalCalories = Number(payload?.totalMacros?.calories || items.reduce((sum: number, it: any) => sum + (it.calories || 0), 0));
    const totalMacros = {
      protein: Number(payload?.totalMacros?.protein_g || items.reduce((s: number, it: any) => s + (it.macros?.protein || 0), 0)),
      carbs: Number(payload?.totalMacros?.carbs_g || items.reduce((s: number, it: any) => s + (it.macros?.carbs || 0), 0)),
      fat: Number(payload?.totalMacros?.fats_g || items.reduce((s: number, it: any) => s + (it.macros?.fat || 0), 0)),
      fiber: Number(payload?.totalMacros?.fiber_g || items.reduce((s: number, it: any) => s + (it.macros?.fiber || 0), 0)),
      sugar: Number(payload?.totalMacros?.sugar_g || items.reduce((s: number, it: any) => s + (it.macros?.sugar || 0), 0)),
      sodium: Number(payload?.totalMacros?.sodium_mg || items.reduce((s: number, it: any) => s + (it.macros?.sodium || 0), 0)),
    };

    return {
      id: `meal-${Date.now()}`,
      name: payload?.isHomogeneousFoodDetected ? 'Meal' : 'Analyzed Meal',
      items,
      totalCalories,
      totalMacros,
      photo: photoUri,
      timestamp: Date.now(),
    };
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}> 
      {cameraPermission?.granted ? (
        <View style={styles.cameraWrap}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableTorch={torch === 'on'}
          />
          <View style={styles.cameraOverlay} pointerEvents="none">
            <View style={[styles.overlayBox, { borderColor: theme.colors.primary }]} />
          </View>
          {frozenUri ? (
            <Image source={{ uri: frozenUri }} style={styles.freeze} resizeMode="cover" />
          ) : null}
        </View>
      ) : (
        <View style={[styles.cameraPlaceholder, { backgroundColor: theme.colors.surface }]}> 
          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>We need camera access</Text>
          <PrimaryButton onPress={() => requestCameraPermission()}>Grant Permission</PrimaryButton>
        </View>
      )}

      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surface, opacity: uploading ? 0.6 : 1 }]} onPress={() => { if (!uploading) handlePickFromLibrary(); }}> 
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{uploading ? 'Uploading…' : 'Upload Photo'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surface, opacity: uploading ? 0.6 : 1 }]} onPress={() => { if (!uploading) setTorch(t => (t === 'on' ? 'off' : 'on')); }}> 
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{torch === 'on' ? 'Flash On' : 'Flash Off'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.surface, opacity: uploading ? 0.6 : 1 }]} onPress={() => { if (!uploading) setFacing(f => (f === 'back' ? 'front' : 'back')); }}> 
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>Flip</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 24 }}>
          {uploading ? (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
              <Text style={{ marginTop: 12, color: theme.colors.muted }}>Analyzing your meal…</Text>
            </View>
          ) : (
            <PrimaryButton onPress={handleSnapFromPreview} icon={<Text>📷</Text>}>
              Scan Meal
            </PrimaryButton>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrap: { height: 420, margin: 16, borderRadius: 16, overflow: 'hidden' },
  camera: { flex: 1 },
  cameraOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  overlayBox: { width: '80%', height: '60%', borderWidth: 2, borderRadius: 16 },
  cameraPlaceholder: { height: 360, margin: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionBtn: { paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, minWidth: 90, alignItems: 'center' },
  freeze: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});