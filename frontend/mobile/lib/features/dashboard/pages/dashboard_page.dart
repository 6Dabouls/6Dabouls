import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Bonjour 👋', style: theme.textTheme.bodyLarge?.copyWith(color: Colors.grey)),
                  Text('Mon portefeuille', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
                ]),
                IconButton(onPressed: () => context.go('/notifications'),
                  icon: Badge(child: const Icon(Icons.notifications_outlined))),
              ]),
              const SizedBox(height: 20),

              // Wallet card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [theme.colorScheme.primary, theme.colorScheme.primary.withOpacity(0.8)]),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('Valeur nette', style: TextStyle(color: Colors.white70, fontSize: 14)),
                  const SizedBox(height: 8),
                  const Text('2 450 000 FCFA', style: TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  Row(children: [
                    _statChip('Capital', '2 200 000'),
                    const SizedBox(width: 16),
                    _statChip('Revenus', '250 000'),
                  ]),
                ]),
              ),
              const SizedBox(height: 20),

              // Quick actions
              Text('Actions rapides', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Row(children: [
                _actionCard(context, Icons.folder_outlined, 'Projets', '/projects', theme),
                const SizedBox(width: 12),
                _actionCard(context, Icons.credit_card_outlined, 'Paiements', '/payments', theme),
                const SizedBox(width: 12),
                _actionCard(context, Icons.security_outlined, 'KYC', '/kyc', theme),
                const SizedBox(width: 12),
                _actionCard(context, Icons.pie_chart_outlined, 'Portfolio', '/portfolio', theme),
              ]),
              const SizedBox(height: 20),

              // Featured projects placeholder
              Text('Projets à la une', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              ...List.generate(2, (i) => _projectCard(context, i, theme)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statChip(String label, String value) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
    Text('$value FCFA', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
  ]);

  Widget _actionCard(BuildContext ctx, IconData icon, String label, String route, ThemeData theme) => Expanded(
    child: InkWell(
      onTap: () => ctx.go(route),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceVariant.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(children: [
          Icon(icon, color: theme.colorScheme.primary, size: 22),
          const SizedBox(height: 6),
          Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500), textAlign: TextAlign.center),
        ]),
      ),
    ),
  );

  Widget _projectCard(BuildContext ctx, int i, ThemeData theme) {
    final projects = [
      {'name': 'Centrale Solaire Abidjan Nord', 'return': '9.5', 'type': '☀️', 'progress': 0.68},
      {'name': 'Parc Éolien Dakar Côte', 'return': '8.2', 'type': '💨', 'progress': 0.45},
    ];
    final p = projects[i];
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () => ctx.go('/projects/demo-$i'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(p['type'] as String, style: const TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Expanded(child: Text(p['name'] as String,
                style: const TextStyle(fontWeight: FontWeight.w600))),
              Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(8)),
                child: Text('${p['return']}% / an', style: const TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 12))),
            ]),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: p['progress'] as double,
              backgroundColor: Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation(theme.colorScheme.primary),
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 4),
            Text('${((p['progress'] as double) * 100).toInt()}% financé',
              style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ]),
        ),
      ),
    );
  }
}
