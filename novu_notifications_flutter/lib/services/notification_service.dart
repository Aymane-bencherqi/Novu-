// Web-safe stub: NotificationService does nothing on web.
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();

  Future<void> initialize(BuildContext context) async {
    if (!kIsWeb) {
      await _initLocalNotifications();
    } else {
      print('Push/local notifications are not supported on Flutter web.');
    }
  }

  Future<void> _initLocalNotifications() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings();
    const settings = InitializationSettings(android: android, iOS: ios);
    await _localNotifications.initialize(settings);
  }

  Future<void> showLocalNotification({required String title, required String body, String? payload}) async {
    if (!kIsWeb) {
      const android = AndroidNotificationDetails('novu', 'Novu', importance: Importance.max, priority: Priority.high);
      const ios = DarwinNotificationDetails();
      const details = NotificationDetails(android: android, iOS: ios);
      await _localNotifications.show(0, title, body, details, payload: payload);
    }
  }
} 
