import 'package:flutter/material.dart';
import 'screens/landing_screen.dart';
import 'services/novu_api_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Provide your Novu API details here
    final novuApiService = NovuApiService(
      baseUrl: 'http://localhost:3000', // TODO: Replace with your Novu API URL
      authToken: '19cc3710f7b4a999fe90304a7013ee35',
      environmentId:
          '67f30867a1b4e056c9572644', // TODO: Replace with your environment ID,
    );

    return MaterialApp(
      title: 'Novu Notifications',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: LandingScreen(novuApiService: novuApiService),
    );
  }
}
