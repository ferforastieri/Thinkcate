import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: number;
}

const logoXml = `
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="60" cy="60" r="58" fill="#2C3E50" stroke="#34495E" stroke-width="4"/>
  
  <!-- Notebook pages - smaller and more to the right -->
  <rect x="40" y="30" width="40" height="60" rx="4" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1.5"/>
  <rect x="45" y="35" width="30" height="50" rx="3" fill="#FFFFFF" stroke="#E8E8E8" stroke-width="1"/>
  
  <!-- Spiral binding -->
  <circle cx="45" cy="40" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="46" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="52" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="58" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="64" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="70" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="76" r="2" fill="#95A5A6"/>
  <circle cx="45" cy="82" r="2" fill="#95A5A6"/>
  
  <!-- Text lines -->
  <line x1="50" y1="40" x2="70" y2="40" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="46" x2="68" y2="46" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="52" x2="70" y2="52" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="58" x2="65" y2="58" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="64" x2="67" y2="64" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="70" x2="63" y2="70" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="76" x2="69" y2="76" stroke="#BDC3C7" stroke-width="1"/>
  <line x1="50" y1="82" x2="66" y2="82" stroke="#BDC3C7" stroke-width="1"/>
  
  <!-- Letter T written in notebook - higher up -->
  <text x="60" y="55" font-family="serif" font-size="20" font-weight="bold" fill="#2C3E50" text-anchor="middle">T</text>
</svg>
`;

export default function Logo({ size = width * 0.22, showText = true, textSize = width * 0.08 }: LogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: size, height: size }]}>
        <SvgXml xml={logoXml} width={size} height={size} />
      </View>
      {showText && (
        <>
          <Text style={[styles.title, { fontSize: textSize }]}>Thinkcate</Text>
          <Text style={styles.subtitle}>Seu bloco de notas pessoal</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#6C757D',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: width * 0.05,
  },
});
