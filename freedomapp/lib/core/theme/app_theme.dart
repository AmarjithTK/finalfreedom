import 'package:flutter/material.dart';

class AppTheme {
  // Premium Light Theme Palette (Calm, Minimalist, High-Contrast)
  static const Color background = Color(0xFFF9FAFB); // Soft, cool off-white
  static const Color cardSurface = Color(0xFFFFFFFF); // Pure white for elevation
  static const Color textPrimary = Color(0xFF111827); // Deep slate/almost black
  static const Color textSecondary = Color(0xFF6B7280); // Cool gray
  
  // Minimalist Swipe Feedback Background Tints (Very Soft)
  static const Color alignGlow = Color(0xFFECFDF5); // Emerald 50 (Soft green)
  static const Color illusionGlow = Color(0xFFFFF1F2); // Rose 50 (Soft red)

  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: background,
      primaryColor: textPrimary,
      fontFamily: 'Inter',
      textTheme: const TextTheme(
        // Used for Front Card Text (The Illusion) - Heavy, commanding
        headlineMedium: TextStyle(
          color: textPrimary, 
          fontSize: 26, 
          fontWeight: FontWeight.w600,
        ),
        // Used for Back Card Text (The Reality Check) - Analytical, roomy height
        bodyLarge: TextStyle(
          color: textPrimary, 
          fontSize: 18, 
          fontWeight: FontWeight.w400, 
          height: 1.6,
        ),
        // Used for UI labels, progress bars
        bodyMedium: TextStyle(
          color: textSecondary, 
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
      ),
      useMaterial3: true,
    );
  }
}
