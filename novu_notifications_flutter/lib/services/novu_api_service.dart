import 'dart:convert';
import 'package:http/http.dart' as http;

// Custom exceptions for better error handling
class NovuApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? responseBody;
  final String? endpoint;

  NovuApiException({
    required this.message,
    this.statusCode,
    this.responseBody,
    this.endpoint,
  });

  @override
  String toString() {
    return 'NovuApiException: $message${statusCode != null ? ' (Status: $statusCode)' : ''}${endpoint != null ? ' - Endpoint: $endpoint' : ''}${responseBody != null ? ' - Response: $responseBody' : ''}';
  }
}

class NovuApiService {
  final String baseUrl;
  final String authToken;
  final String environmentId;

  NovuApiService({
    required this.baseUrl,
    required this.authToken,
    required this.environmentId,
  });

  Map<String, String> get _headers => {
        'Authorization': authToken.startsWith('Bearer ')
            ? authToken.replaceFirst('Bearer ', 'ApiKey ')
            : (authToken.startsWith('ApiKey ')
                ? authToken
                : 'ApiKey $authToken'),
        'Content-Type': 'application/json',
        'Novu-Environment-Id': environmentId,
      };

  // Helper method to handle HTTP responses
  void _handleHttpResponse(http.Response response, String endpoint) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return; // Success
    }

    String errorMessage;
    String? responseBody;

    try {
      responseBody = response.body;
      final errorData = jsonDecode(response.body);
      errorMessage =
          errorData['message'] ?? errorData['error'] ?? 'Unknown error';
    } catch (e) {
      errorMessage = 'Invalid JSON response';
      responseBody = response.body;
    }

    switch (response.statusCode) {
      case 400:
        throw NovuApiException(
          message: 'Bad Request: $errorMessage',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 401:
        throw NovuApiException(
          message: 'Unauthorized: Invalid or missing authentication token',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 403:
        throw NovuApiException(
          message:
              'Forbidden: You don\'t have permission to access this resource',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 404:
        throw NovuApiException(
          message: 'Not Found: The requested resource was not found',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 429:
        throw NovuApiException(
          message: 'Rate Limited: Too many requests, please try again later',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 500:
        throw NovuApiException(
          message: 'Internal Server Error: Server encountered an error',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 502:
        throw NovuApiException(
          message: 'Bad Gateway: Server is temporarily unavailable',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      case 503:
        throw NovuApiException(
          message: 'Service Unavailable: Server is temporarily unavailable',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
      default:
        throw NovuApiException(
          message: 'HTTP Error $response.statusCode: $errorMessage',
          statusCode: response.statusCode,
          responseBody: responseBody,
          endpoint: endpoint,
        );
    }
  }

  // Fetch notifications for the current user
  Future<List<dynamic>> fetchNotifications() async {
    const endpoint = '/v1/notifications';

    try {
      print('Fetching notifications from: $baseUrl$endpoint');
      print('Headers: $_headers');

      final response = await http
          .get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      )
          .timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NovuApiException(
            message: 'Request timeout: Server took too long to respond',
            endpoint: endpoint,
          );
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      _handleHttpResponse(response, endpoint);

      final data = jsonDecode(response.body);

      // Validate response structure
      if (data == null) {
        throw NovuApiException(
          message: 'Invalid response: Response body is null',
          responseBody: response.body,
          endpoint: endpoint,
        );
      }

      if (data is! Map<String, dynamic>) {
        throw NovuApiException(
          message:
              'Invalid response: Expected JSON object, got ${data.runtimeType}',
          responseBody: response.body,
          endpoint: endpoint,
        );
      }

      final notifications = data['data'];
      if (notifications == null) {
        print('Warning: No "data" field in response, returning empty list');
        return [];
      }

      if (notifications is! List) {
        throw NovuApiException(
          message:
              'Invalid response: Expected list of notifications, got ${notifications.runtimeType}',
          responseBody: response.body,
          endpoint: endpoint,
        );
      }

      return notifications;
    } on NovuApiException {
      rethrow; // Re-throw our custom exceptions
    } on FormatException catch (e) {
      throw NovuApiException(
        message: 'Invalid JSON response: ${e.message}',
        endpoint: endpoint,
      );
    } catch (e) {
      throw NovuApiException(
        message: 'Network error: ${e.toString()}',
        endpoint: endpoint,
      );
    }
  }

  // Mark a notification as read
  Future<void> markAsRead(String notificationId) async {
    final endpoint = '/v1/notifications/$notificationId/read';

    try {
      print('Marking notification as read: $baseUrl$endpoint');
      print('Headers: $_headers');

      final response = await http
          .post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      )
          .timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw NovuApiException(
            message: 'Request timeout: Server took too long to respond',
            endpoint: endpoint,
          );
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      _handleHttpResponse(response, endpoint);
    } on NovuApiException {
      rethrow;
    } catch (e) {
      throw NovuApiException(
        message: 'Network error: ${e.toString()}',
        endpoint: endpoint,
      );
    }
  }

  // Test connection to verify API credentials
  Future<bool> testConnection() async {
    const endpoint = '/v1/environments/me';

    try {
      print('Testing connection to: $baseUrl$endpoint');
      print('Headers: $_headers');

      final response = await http
          .get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      )
          .timeout(
        const Duration(seconds: 10),
        onTimeout: () {
          throw NovuApiException(
            message: 'Connection timeout: Unable to reach the server',
            endpoint: endpoint,
          );
        },
      );

      print('Connection test response status: ${response.statusCode}');
      print('Connection test response body: ${response.body}');

      if (response.statusCode == 200) {
        return true;
      } else {
        _handleHttpResponse(response, endpoint);
        return false;
      }
    } catch (e) {
      print('Connection test failed: ${e.toString()}');
      return false;
    }
  }
}
