import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import '../services/novu_api_service.dart';
import '../services/notification_service.dart';

class NotificationsScreen extends StatefulWidget {
  final NovuApiService novuApiService;
  const NotificationsScreen({Key? key, required this.novuApiService}) : super(key: key);

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  late Future<List<dynamic>> _notificationsFuture;
  bool _isTestingConnection = false;

  @override
  void initState() {
    super.initState();
    _notificationsFuture = widget.novuApiService.fetchNotifications();
    NotificationService().initialize(context);
  }

  Future<void> _refreshNotifications() async {
    setState(() {
      _notificationsFuture = widget.novuApiService.fetchNotifications();
    });
  }

  Future<void> _testConnection() async {
    setState(() {
      _isTestingConnection = true;
    });

    try {
      final isConnected = await widget.novuApiService.testConnection();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(isConnected ? 'Connection successful!' : 'Connection failed'),
            backgroundColor: isConnected ? Colors.green : Colors.red,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Connection test failed: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isTestingConnection = false;
        });
      }
    }
  }

  IconData _getChannelIcon(Map<String, dynamic> payload) {
    if (payload.containsKey('email')) return Icons.email;
    if (payload.containsKey('sms')) return Icons.sms;
    if (payload.containsKey('push')) return Icons.notifications;
    if (payload.containsKey('inApp')) return Icons.message;
    return Icons.notifications_none;
  }

  String _getSubject(Map<String, dynamic> payload) {
    if (payload['email'] is Map && payload['email']['subject'] != null) {
      return payload['email']['subject'];
    }
    return 'No Title';
  }

  String? _getHtmlContent(Map<String, dynamic> payload) {
    if (payload['email'] is Map && payload['email']['htmlContent'] != null) {
      return payload['email']['htmlContent'];
    }
    return null;
  }

  String? _getTextContent(Map<String, dynamic> payload) {
    if (payload['email'] is Map && payload['email']['textContent'] != null) {
      return payload['email']['textContent'];
    }
    return null;
  }

  String _getDate(dynamic notification) {
    if (notification is Map && notification['createdAt'] != null) {
      return DateTime.tryParse(notification['createdAt'])?.toLocal().toString().split('.')[0] ?? '';
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        leading: Navigator.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshNotifications,
            tooltip: 'Refresh notifications',
          ),
          IconButton(
            icon: const Icon(Icons.wifi),
            onPressed: _isTestingConnection ? null : _testConnection,
            tooltip: 'Test connection',
          ),
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _notificationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Loading notifications...'),
                ],
              ),
            );
          } else if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error, size: 64, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Error Loading Notifications',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: _refreshNotifications,
                      icon: const Icon(Icons.refresh),
                      label: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.notifications_none,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No notifications found',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'You\'re all caught up!',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[500],
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: _refreshNotifications,
                    icon: const Icon(Icons.refresh),
                    label: const Text('Refresh'),
                  ),
                ],
              ),
            );
          }

          final notifications = snapshot.data!;
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: notifications.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final notification = notifications[index];
              final payload = notification['payload'] as Map<String, dynamic>? ?? {};
              final subject = _getSubject(payload);
              final htmlContent = _getHtmlContent(payload);
              final textContent = _getTextContent(payload);
              final date = _getDate(notification);
              final channelIcon = _getChannelIcon(payload);

              return Card(
                elevation: 4,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(channelIcon, color: Colors.blue, size: 28),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              subject,
                              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ),
                          if (date.isNotEmpty)
                            Text(
                              date,
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      if (htmlContent != null && htmlContent.isNotEmpty)
                        Html(data: htmlContent),
                      if ((htmlContent == null || htmlContent.isEmpty) && textContent != null)
                        Text(
                          textContent,
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
} 