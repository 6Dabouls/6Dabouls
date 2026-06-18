import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import '../../features/auth/pages/login_page.dart';
import '../../features/auth/pages/register_page.dart';
import '../../features/auth/pages/two_factor_page.dart';
import '../../features/dashboard/pages/dashboard_page.dart';
import '../../features/projects/pages/projects_page.dart';
import '../../features/projects/pages/project_detail_page.dart';
import '../../features/portfolio/pages/portfolio_page.dart';
import '../../features/payments/pages/payments_page.dart';
import '../../features/kyc/pages/kyc_page.dart';
import '../../features/profile/pages/profile_page.dart';
import '../../features/notifications/pages/notifications_page.dart';
import '../../shared/widgets/main_scaffold.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      // Auth routes
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterPage()),
      GoRoute(path: '/2fa', builder: (_, __) => const TwoFactorPage()),

      // Main app shell
      ShellRoute(
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(path: '/dashboard', builder: (_, __) => const DashboardPage()),
          GoRoute(path: '/projects', builder: (_, __) => const ProjectsPage()),
          GoRoute(path: '/projects/:id', builder: (_, s) => ProjectDetailPage(id: s.pathParameters['id']!)),
          GoRoute(path: '/portfolio', builder: (_, __) => const PortfolioPage()),
          GoRoute(path: '/payments', builder: (_, __) => const PaymentsPage()),
          GoRoute(path: '/kyc', builder: (_, __) => const KycPage()),
          GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
          GoRoute(path: '/notifications', builder: (_, __) => const NotificationsPage()),
        ],
      ),
    ],
  );
});
