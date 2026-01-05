/**
 * KWIZ UI Component - Text
 * Custom text component with predefined styles
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { colors, textStyles } from '../../constants';

export type TextVariant =
    | 'displayLarge' | 'displayMedium' | 'displaySmall'
    | 'h1' | 'h2' | 'h3' | 'h4'
    | 'bodyLarge' | 'bodyMedium' | 'bodySmall' | 'bodyXSmall'
    | 'labelLarge' | 'labelMedium' | 'labelSmall'
    | 'questionText' | 'optionText' | 'timerText' | 'scoreText' | 'levelText'
    | 'buttonLarge' | 'buttonMedium' | 'buttonSmall';

export type TextColor =
    | 'primary' | 'secondary' | 'muted' | 'inverse'
    | 'accent' | 'success' | 'error' | 'white';

interface TextProps extends RNTextProps {
    variant?: TextVariant;
    color?: TextColor;
    align?: 'left' | 'center' | 'right';
    children: React.ReactNode;
}

export function Text({
    variant = 'bodyMedium',
    color = 'primary',
    align,
    style,
    children,
    ...props
}: TextProps) {
    const variantStyle = textStyles[variant];
    const textColor = colors.text[color];

    return (
        <RNText
            style={[
                variantStyle,
                { color: textColor },
                align && { textAlign: align },
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
}

// Convenience components
export function DisplayText(props: Omit<TextProps, 'variant'> & { size?: 'large' | 'medium' | 'small' }) {
    const variant = `display${props.size ? props.size.charAt(0).toUpperCase() + props.size.slice(1) : 'Medium'}` as TextVariant;
    return <Text variant={variant} {...props} />;
}

export function Heading(props: Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 | 4 }) {
    const variant = `h${props.level || 1}` as TextVariant;
    return <Text variant={variant} {...props} />;
}

export function BodyText(props: Omit<TextProps, 'variant'> & { size?: 'large' | 'medium' | 'small' | 'xsmall' }) {
    const sizeMap = { large: 'Large', medium: 'Medium', small: 'Small', xsmall: 'XSmall' };
    const variant = `body${sizeMap[props.size || 'medium']}` as TextVariant;
    return <Text variant={variant} {...props} />;
}

export function Label(props: Omit<TextProps, 'variant'> & { size?: 'large' | 'medium' | 'small' }) {
    const sizeMap = { large: 'Large', medium: 'Medium', small: 'Small' };
    const variant = `label${sizeMap[props.size || 'medium']}` as TextVariant;
    return <Text variant={variant} {...props} />;
}

export default Text;
