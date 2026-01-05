/**
 * KWIZ App - Scan QR Screen
 * QR code scanner for joining quizzes
 */

import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { QRScanner } from '@/components/QRScanner';
import { palette } from '@/constants';
import { useUserStore } from '@/store';

export default function ScanScreen() {
    const [isScanning, setIsScanning] = useState(true);
    const { displayName, avatarId } = useUserStore();

    const handleScan = (code: string) => {
        console.log('Scanned code:', code);

        // Navigate to join screen with the code
        router.push({
            pathname: '/join',
            params: { code },
        });
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[palette.primary, palette.brown[800]]}
                style={StyleSheet.absoluteFill}
            />
            <QRScanner
                onScan={handleScan}
                onClose={handleClose}
                isActive={isScanning}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
