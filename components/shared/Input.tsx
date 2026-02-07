import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { border, primary, surface, text, textTertiary } from '../../constants/Colors';
import { theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    error && styles.inputContainerError,
                ]}
            >
                <RNTextInput
                    style={styles.input}
                    placeholderTextColor={textTertiary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...textInputProps}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.base,
    },
    label: {
        ...theme.typography.captionMedium,
        color: text,
        marginBottom: theme.spacing.sm,
    },
    inputContainer: {
        height: theme.sizes.inputHeight,
        backgroundColor: surface,
        borderRadius: theme.borderRadius.base,
        borderWidth: 1,
        borderColor: border,
        paddingHorizontal: theme.spacing.base,
        justifyContent: 'center',
    },
    inputContainerFocused: {
        borderColor: primary,
        borderWidth: 2,
    },
    inputContainerError: {
        borderColor: '#EF4444',
    },
    input: {
        ...theme.typography.body,
        color: text,
        padding: 0,
    },
    errorText: {
        ...theme.typography.caption,
        color: '#EF4444',
        marginTop: theme.spacing.xs,
    },
});
