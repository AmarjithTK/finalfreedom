import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: TruthEngineApp()));
}

class TruthEngineApp extends StatelessWidget {
  const TruthEngineApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Truth Engine',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SwipeEngineScreen(),
    );
  }
}

class SwipeEngineScreen extends StatefulWidget {
  const SwipeEngineScreen({super.key});

  @override
  State<SwipeEngineScreen> createState() => _SwipeEngineScreenState();
}

class _SwipeEngineScreenState extends State<SwipeEngineScreen> with TickerProviderStateMixin {
  Offset _dragOffset = Offset.zero;
  int _currentIndex = 0;
  
  // States
  bool _isFlipped = false;
  bool _swipedRight = false; // Used to determine if they picked Agree or Disagree

  late AnimationController _springController;
  late Animation<Offset> _springAnimation;

  late AnimationController _flipController;
  late Animation<double> _flipAnimation;

  // The Mock Deck based on app_content
  final List<Map<String, dynamic>> _deck = [
    {
      "front": "Pornography acts as a genuine stress-reliever because of the dopamine rush.",
      "back": "Dopamine is purely excitatory. It raises heart rate, blood pressure, and cortisol. The only 'stress' it relieves is the artificial withdrawal pang specifically created by your last session.",
      "isIllusion": true, 
    },
    {
      "front": "The physical withdrawal is intensely painful, which is why willpower always fails.",
      "back": "The physical withdrawal from dopamine overstimulation is virtually imperceptible. It is just an empty, slightly insecure feeling. 100% of the agony is caused by the mental conflict of 'I want it but I can't have it.'",
      "isIllusion": true,
    },
    {
      "front": "Just one peak won't hurt, as long as you don't fully relapse.",
      "back": "Feeding a craving guarantees it will return tomorrow, slightly stronger. The 'Little Monster' only dies if you completely starve it of oxygen.",
      "isIllusion": false, // This is an Obvious Truth
    }
  ];

  @override
  void initState() {
    super.initState();
    // Spring physics for dragging
    _springController = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _springController.addListener(() {
      setState(() {
        _dragOffset = _springAnimation.value;
      });
    });

    // 3D Flip Animation
    _flipController = AnimationController(vsync: this, duration: const Duration(milliseconds: 500));
    _flipAnimation = Tween<double>(begin: 0, end: pi).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOutCubic)
    );
    _flipController.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _springController.dispose();
    _flipController.dispose();
    super.dispose();
  }

  void _onPanStart(DragStartDetails details) {
    if (_isFlipped) return; // Cannot drag while reading the back
    _springController.stop();
  }

  void _onPanUpdate(DragUpdateDetails details) {
    if (_isFlipped) return;
    setState(() {
      _dragOffset += details.delta;
    });
  }

  void _onPanEnd(DragEndDetails details) {
    if (_isFlipped) return;
    
    final screenWidth = MediaQuery.of(context).size.width;
    final threshold = screenWidth * 0.35;
    
    if (_dragOffset.dx > threshold) {
      _triggerFlip(swipedRight: true);
    } else if (_dragOffset.dx < -threshold) {
      _triggerFlip(swipedRight: false);
    } else {
      // Snap back to center
      _springAnimation = Tween<Offset>(begin: _dragOffset, end: Offset.zero).animate(
        CurvedAnimation(parent: _springController, curve: Curves.easeOutBack)
      );
      _springController.forward(from: 0.0);
    }
  }

  void _triggerFlip({required bool swipedRight}) {
    HapticFeedback.lightImpact(); // The snap trigger
    _swipedRight = swipedRight;
    
    // Smoothly snap the card dead-center first
    _springAnimation = Tween<Offset>(begin: _dragOffset, end: Offset.zero).animate(
      CurvedAnimation(parent: _springController, curve: Curves.easeOutCirc)
    );
    
    _springController.forward(from: 0.0).then((_) {
      // Execute 3D Flip
      _isFlipped = true;
      
      // Determine psychological shock
      final bool isIllusion = _deck[_currentIndex]["isIllusion"];
      // If card is an illusion, user should swipe LEFT (Disagree).
      // If they swiped Right (Agree) on an illusion, they fell for it.
      bool isCorrect = (isIllusion && !swipedRight) || (!isIllusion && swipedRight);
      
      if (isCorrect) {
        HapticFeedback.mediumImpact(); // Aligned
      } else {
        HapticFeedback.heavyImpact(); // Shock! They fell for the illusion
      }

      _flipController.forward(from: 0.0);
    });
  }

  void _nextCard() {
    HapticFeedback.selectionClick();
    setState(() {
      _isFlipped = false;
      _flipController.reset();
      
      if (_currentIndex < _deck.length - 1) {
        _currentIndex++;
      } else {
        _currentIndex = 0; // Loop for prototype
      }
    });
  }

  Color _getBackgroundColor() {
    // If flipped, lock the colored background based on whether they were right or wrong
    if (_isFlipped) {
      final bool isIllusion = _deck[_currentIndex]["isIllusion"];
      bool isCorrect = (isIllusion && !_swipedRight) || (!isIllusion && _swipedRight);
      return isCorrect ? AppTheme.alignGlow : AppTheme.illusionGlow;
    }

    if (_dragOffset.dx == 0) return AppTheme.background;
    
    // Calculate 0.0 to 1.0 interpolation for drag
    final double maxDrag = MediaQuery.of(context).size.width * 0.4;
    final double progress = (_dragOffset.dx.abs() / maxDrag).clamp(0.0, 1.0);
    
    if (_dragOffset.dx > 0) {
      return Color.lerp(AppTheme.background, AppTheme.alignGlow, progress)!;
    } else {
      return Color.lerp(AppTheme.background, AppTheme.illusionGlow, progress)!;
    }
  }

  Widget _buildFrontCard() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.cardSurface,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 40,
            spreadRadius: 4,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(32),
      child: Center(
        child: Text(
          _deck[_currentIndex]["front"],
          style: Theme.of(context).textTheme.headlineMedium,
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildBackCard() {
    final bool isIllusion = _deck[_currentIndex]["isIllusion"];
    bool isCorrect = (isIllusion && !_swipedRight) || (!isIllusion && _swipedRight);
    
    return Transform(
      alignment: Alignment.center,
      transform: Matrix4.identity()..rotateY(pi), // Un-mirror the text from the flip
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.cardSurface,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isCorrect ? Colors.green.withValues(alpha: 0.2) : Colors.red.withValues(alpha: 0.2),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 40,
              spreadRadius: 4,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            const SizedBox(height: 16),
            // Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isCorrect ? AppTheme.alignGlow : AppTheme.illusionGlow,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                isCorrect ? "PERCEPTION ALIGNED" : "ILLUSION DETECTED",
                style: TextStyle(
                  color: isCorrect ? Colors.green[800] : Colors.red[800],
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                  letterSpacing: 1.2,
                ),
              ),
            ),
            const Spacer(),
            Text(
              "REALITY CHECK",
              style: TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              _deck[_currentIndex]["back"],
              style: Theme.of(context).textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _nextCard,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.textPrimary,
                  foregroundColor: AppTheme.background,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text("Internalize & Continue", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    // Calculate rotation angle (max 4.0 degrees / 0.07 radians)
    final double tilt = (_dragOffset.dx / screenWidth) * 0.07;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      color: _getBackgroundColor(),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: SafeArea(
          child: Column(
            children: [
              // Progress Bar Area
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Deck 1: The Matrix', style: Theme.of(context).textTheme.bodyMedium),
                    Text('${_currentIndex + 1} / ${_deck.length}', style: Theme.of(context).textTheme.bodyMedium),
                  ],
                ),
              ),
              
              // Animated Line Progress
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Container(
                  height: 4,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppTheme.textSecondary.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(2),
                  ),
                  child: AnimatedFractionallySizedBox(
                    duration: const Duration(milliseconds: 300),
                    alignment: Alignment.centerLeft,
                    widthFactor: (_currentIndex + 1) / _deck.length,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.textPrimary,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ),
              
              Spacer(),
              
              // Interactive 3D Card Area
              GestureDetector(
                onPanStart: _onPanStart,
                onPanUpdate: _onPanUpdate,
                onPanEnd: _onPanEnd,
                child: Transform.translate(
                  offset: _dragOffset,
                  child: Transform.rotate(
                    angle: tilt,
                    child: AnimatedBuilder(
                      animation: _flipAnimation,
                      builder: (context, child) {
                        // Matrix4 perspective for 3D spin
                        final transform = Matrix4.identity()
                          ..setEntry(3, 2, 0.001)
                          ..rotateY(_flipAnimation.value);

                        return Transform(
                          alignment: Alignment.center,
                          transform: transform,
                          child: Container(
                            width: screenWidth * 0.85,
                            height: 500,
                            // If animated halfway (90deg), show the back text
                            child: _flipAnimation.value < (pi / 2) 
                                 ? _buildFrontCard() 
                                 : _buildBackCard(),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ),
              
              Spacer(),
              
              // UI Hints
              AnimatedOpacity(
                opacity: _isFlipped ? 0.0 : 1.0,
                duration: const Duration(milliseconds: 200),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 40, left: 32, right: 32),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      AnimatedOpacity(
                        opacity: _dragOffset.dx < -10 ? 1.0 : (_dragOffset.dx > 10 ? 0.0 : 0.3),
                        duration: const Duration(milliseconds: 150),
                        child: Text('← Illusion', style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          color: _dragOffset.dx < -10 ? Colors.red[800] : AppTheme.textSecondary,
                          fontWeight: FontWeight.w700,
                        )),
                      ),
                      AnimatedOpacity(
                        opacity: _dragOffset.dx > 10 ? 1.0 : (_dragOffset.dx < -10 ? 0.0 : 0.3),
                        duration: const Duration(milliseconds: 150),
                        child: Text('Truth →', style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                          color: _dragOffset.dx > 10 ? Colors.green[800] : AppTheme.textSecondary,
                          fontWeight: FontWeight.w700,
                        )),
                      ),
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
