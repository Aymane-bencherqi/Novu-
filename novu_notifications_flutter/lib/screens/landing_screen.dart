import 'package:flutter/material.dart';
import 'notifications_screen.dart';
import '../services/novu_api_service.dart';

class LandingScreen extends StatefulWidget {
  final NovuApiService novuApiService;
  const LandingScreen({Key? key, required this.novuApiService}) : super(key: key);

  @override
  State<LandingScreen> createState() => _LandingScreenState();
}

class _LandingScreenState extends State<LandingScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _arrowAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _arrowAnimation = Tween<double>(begin: 0, end: 32).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _fadeAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _goToNotifications() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => NotificationsScreen(novuApiService: widget.novuApiService),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFe0e7ff), Color(0xFFf8fafc)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Card(
          elevation: 8,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          margin: const EdgeInsets.symmetric(horizontal: 24),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 40),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const FlutterLogo(size: 72),
                const SizedBox(height: 16),
                Text(
                  'Novu Notifications',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Colors.blue[900],
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Powered by Flutter & Novu',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.blueGrey[700],
                        fontWeight: FontWeight.w500,
                      ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.flutter_dash, color: Colors.blue, size: 36),
                    AnimatedBuilder(
                      animation: _controller,
                      builder: (context, child) {
                        return Row(
                          children: [
                            SizedBox(width: _arrowAnimation.value),
                            Opacity(
                              opacity: _fadeAnimation.value,
                              child: Icon(Icons.arrow_forward, color: Colors.blueAccent, size: 36),
                            ),
                            SizedBox(width: _arrowAnimation.value),
                          ],
                        );
                      },
                    ),
                    CircleAvatar(
                      radius: 20,
                      backgroundColor: Colors.blue[50],
                      backgroundImage: const AssetImage('assets/novu logo.png'),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Send a request to Novu to fetch your notifications. Experience modern notification infrastructure with a single click.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.blueGrey[800]),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 36),
                ElevatedButton.icon(
                  onPressed: _goToNotifications,
                  icon: const Icon(Icons.notifications_active, size: 24),
                  label: const Text('Fetch Notifications'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[700],
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 18),
                    textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 4,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 