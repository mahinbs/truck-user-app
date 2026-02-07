import React, { ReactNode, useEffect } from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { surface } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    height?: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    children,
    height = SCREEN_HEIGHT * 0.6,
}) => {
    const translateY = useSharedValue(height);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, {
                damping: 100,
                stiffness: 400,
            });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 250 });
            opacity.value = withTiming(0, { duration: 250 });
        }
    }, [visible]);

    const animatedSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.sheet, { height }, animatedSheetStyle]}>
                    <View style={styles.handle} />
                    <View style={styles.content}>{children}</View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    sheet: {
        backgroundColor: surface,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        paddingBottom: theme.spacing.lg,
        ...theme.shadows.strong,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.base,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
});
