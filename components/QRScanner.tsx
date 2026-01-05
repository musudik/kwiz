/**
 * KWIZ Component - QR Scanner
 * Camera-based QR code scanner for joining quizzes
 */

import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { colors, layout, palette, spacing } from '../constants';
import { playSound } from '../services';
import { Button, Card, Text } from './ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCANNER_SIZE = SCREEN_WIDTH * 0.7;

interface QRScannerProps {
    onScan: (data: string) => void;
    onClose: () => void;
    isActive?: boolean;
}

export function QRScanner({ onScan, onClose, isActive = true }: QRScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [torch, setTorch] = useState(false);

    // Animation for scanner line
    const scanLineAnim = useSharedValue(0);

    useEffect(() => {
        if (isActive && !scanned) {
            scanLineAnim.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        }
    }, [isActive, scanned]);

    const scanLineStyle = useAnimatedStyle(() => ({
        top: `${scanLineAnim.value * 100}%`,
    }));

    const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
        if (scanned) return;

        setScanned(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSound('success');

        // Validate quiz code format (usually 6 alphanumeric characters)
        const isValidQuizCode = /^[A-Z0-9]{4,8}$/i.test(data);

        if (isValidQuizCode) {
            onScan(data.toUpperCase());
        } else {
            // Try to extract quiz code from URL
            const urlMatch = data.match(/code=([A-Z0-9]{4,8})/i);
            if (urlMatch) {
                onScan(urlMatch[1].toUpperCase());
            } else {
                Alert.alert(
                    'Invalid QR Code',
                    'This QR code doesn\'t appear to be a valid quiz code. Please try again.',
                    [{ text: 'OK', onPress: () => setScanned(false) }]
                );
            }
        }
    };

    // Permission not determined yet
    if (!permission) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.primary, palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <Card variant="glass" padding="2xl" style={styles.permissionCard}>
                    <Text variant="h3" color="primary" align="center">
                        Loading Camera...
                    </Text>
                </Card>
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[palette.primary, palette.brown[800]]}
                    style={StyleSheet.absoluteFill}
                />
                <Card variant="glass" padding="2xl" style={styles.permissionCard}>
                    <Text style={styles.permissionIcon}>📷</Text>
                    <Text variant="h3" color="primary" align="center" style={styles.permissionTitle}>
                        Camera Permission
                    </Text>
                    <Text variant="bodyMedium" color="secondary" align="center" style={styles.permissionText}>
                        We need camera access to scan QR codes and join quizzes.
                    </Text>
                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        onPress={requestPermission}
                        style={styles.permissionButton}
                    >
                        Allow Camera Access
                    </Button>
                    <Button
                        variant="ghost"
                        size="medium"
                        onPress={onClose}
                    >
                        Enter Code Manually
                    </Button>
                </Card>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isActive && (
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    enableTorch={torch}
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
            )}

            {/* Overlay */}
            <View style={styles.overlay}>
                {/* Top section */}
                <View style={styles.overlaySection}>
                    <Text variant="h2" color="white" align="center" style={styles.title}>
                        Scan QR Code
                    </Text>
                    <Text variant="bodyMedium" color="secondary" align="center">
                        Point your camera at the quiz QR code
                    </Text>
                </View>

                {/* Scanner frame */}
                <View style={styles.scannerContainer}>
                    <View style={styles.scannerFrame}>
                        {/* Corner decorations */}
                        <View style={[styles.corner, styles.cornerTopLeft]} />
                        <View style={[styles.corner, styles.cornerTopRight]} />
                        <View style={[styles.corner, styles.cornerBottomLeft]} />
                        <View style={[styles.corner, styles.cornerBottomRight]} />

                        {/* Scanning line */}
                        {!scanned && (
                            <Animated.View style={[styles.scanLine, scanLineStyle]}>
                                <LinearGradient
                                    colors={['transparent', colors.interactive.primary, 'transparent']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.scanLineGradient}
                                />
                            </Animated.View>
                        )}

                        {/* Scanned indicator */}
                        {scanned && (
                            <View style={styles.scannedIndicator}>
                                <Text style={styles.scannedIcon}>✓</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Bottom section */}
                <View style={styles.overlaySection}>
                    <View style={styles.buttonRow}>
                        <Button
                            variant={torch ? 'primary' : 'outline'}
                            size="medium"
                            onPress={() => setTorch(!torch)}
                            style={styles.controlButton}
                        >
                            {torch ? '💡 On' : '🔦 Flash'}
                        </Button>
                        <Button
                            variant="outline"
                            size="medium"
                            onPress={onClose}
                            style={styles.controlButton}
                        >
                            ✕ Close
                        </Button>
                    </View>

                    {scanned && (
                        <Button
                            variant="ghost"
                            size="small"
                            onPress={() => setScanned(false)}
                            style={styles.rescanButton}
                        >
                            Tap to scan again
                        </Button>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.primary,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'space-between',
        paddingVertical: spacing['4xl'],
        paddingHorizontal: layout.screenPaddingHorizontal,
    },
    overlaySection: {
        alignItems: 'center',
    },
    title: {
        marginBottom: spacing.sm,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    scannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerFrame: {
        width: SCANNER_SIZE,
        height: SCANNER_SIZE,
        position: 'relative',
        overflow: 'hidden',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: colors.interactive.primary,
        borderWidth: 4,
    },
    cornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 16,
    },
    cornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 16,
    },
    cornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 16,
    },
    cornerBottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 16,
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
    },
    scanLineGradient: {
        flex: 1,
        height: 2,
    },
    scannedIndicator: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(124, 185, 124, 0.3)',
        borderRadius: 16,
    },
    scannedIcon: {
        fontSize: 64,
        color: colors.status.success,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    controlButton: {
        minWidth: 120,
    },
    rescanButton: {
        marginTop: spacing.lg,
    },

    // Permission screen
    permissionCard: {
        marginHorizontal: spacing.xl,
        alignItems: 'center',
    },
    permissionIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    permissionTitle: {
        marginBottom: spacing.md,
    },
    permissionText: {
        marginBottom: spacing['2xl'],
    },
    permissionButton: {
        marginBottom: spacing.md,
    },
});

export default QRScanner;
