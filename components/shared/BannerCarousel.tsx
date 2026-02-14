import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.90;
const SPACING = 12;
const SIDE_INSET = (width - CARD_WIDTH) / 2;

interface BannerItem {
    id: string;
    title: string;
    subtitle: string;
    image: any; // Allow local assets (require) or remote URLs
    action?: () => void;
    buttonText?: string;
}

interface BannerCarouselProps {
    data: BannerItem[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ data }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll functionality
    useEffect(() => {
        const timer = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= data.length) {
                nextIndex = 0;
            }

            scrollViewRef.current?.scrollTo({
                x: nextIndex * (CARD_WIDTH + SPACING), // Scroll by item width + spacing
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 5000); // 5 seconds

        return () => clearInterval(timer);
    }, [currentIndex, data.length]);

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false} // Disable paging for custom snap
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: SIDE_INSET - SPACING / 2, // Center the first item
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
                    setCurrentIndex(index);
                }}
            >
                {data.map((item, index) => {
                    const inputRange = [
                        (index - 1) * (CARD_WIDTH + SPACING),
                        index * (CARD_WIDTH + SPACING),
                        (index + 1) * (CARD_WIDTH + SPACING),
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: 'clamp',
                    });

                    // Handle both remote and local images
                    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

                    return (
                        <View key={item.id} style={styles.cardContainer}>
                            <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={item.action}
                                    style={{ flex: 1 }}
                                >
                                    <Image source={imageSource} style={styles.image} />
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                                        style={styles.overlay}
                                    >
                                        <View style={styles.textContainer}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                                            {item.buttonText && (
                                                <View style={styles.button}>
                                                    <Text style={styles.buttonText}>{item.buttonText}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    );
                })}
            </Animated.ScrollView>

            {/* Pagination Integration */}
            <View style={styles.pagination}>
                {data.map((_, index) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * (CARD_WIDTH + SPACING),
                            index * (CARD_WIDTH + SPACING),
                            (index + 1) * (CARD_WIDTH + SPACING),
                        ],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    const scale = scrollX.interpolate({
                        inputRange: [
                            (index - 1) * (CARD_WIDTH + SPACING),
                            index * (CARD_WIDTH + SPACING),
                            (index + 1) * (CARD_WIDTH + SPACING),
                        ],
                        outputRange: [0.8, 1.2, 0.8],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                { opacity, transform: [{ scale }] },
                                index === currentIndex ? styles.activeDot : null,
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 240,
        marginBottom: theme.spacing.lg,
    },
    scrollContent: {
        // Handled via props
    },
    cardContainer: {
        width: CARD_WIDTH + SPACING, // Each item takes up this much space
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        ...theme.shadows.medium,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        justifyContent: 'flex-end',
        padding: theme.spacing.lg,
    },
    textContainer: {
        gap: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_800ExtraBold',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontFamily: 'PlusJakartaSans_500Medium',
        marginBottom: theme.spacing.xs,
    },
    button: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.light.primary,
    },
    activeDot: {
        width: 24, // Elongated active dot
    }
});
