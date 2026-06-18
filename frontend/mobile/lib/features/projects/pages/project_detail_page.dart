import 'package:flutter/material.dart';

class ProjectDetailPage extends StatelessWidget {
  final String id;
  const ProjectDetailPage({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Détail du projet'), actions: [
        IconButton(icon: const Icon(Icons.share_outlined), onPressed: () {}),
      ]),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(height: 200, color: const Color(0xFFF0FDF4),
              child: const Center(child: Text('☀️', style: TextStyle(fontSize: 80)))),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Wrap(spacing: 8, children: [
                  Chip(label: const Text('☀️ Solaire'), backgroundColor: const Color(0xFFFEF3C7)),
                  Chip(label: const Text('Risque faible'), backgroundColor: const Color(0xFFDCFCE7)),
                ]),
                const SizedBox(height: 8),
                const Text('Centrale Solaire Yamoussoukro', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                const Text('📍 Yamoussoukro, Côte d\'Ivoire', style: TextStyle(color: Colors.grey)),
                const SizedBox(height: 16),
                Row(children: [
                  _statBox('Rendement', '9.5% / an', const Color(0xFF16A34A)),
                  const SizedBox(width: 12),
                  _statBox('Durée', '36 mois', const Color(0xFF2563EB)),
                  const SizedBox(width: 12),
                  _statBox('Min. invest.', '50 000 FCFA', const Color(0xFF7C3AED)),
                ]),
                const SizedBox(height: 16),
                const Text('Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 8),
                const Text(
                  'Ce projet vise à construire une centrale solaire photovoltaïque de 5 MW dans la région des Lacs en Côte d\'Ivoire, contribuant à l\'électrification rurale et à la réduction des émissions de CO₂.',
                  style: TextStyle(color: Colors.grey, height: 1.6),
                ),
                const SizedBox(height: 16),
                LinearProgressIndicator(
                  value: 0.68,
                  backgroundColor: Colors.grey.shade200,
                  valueColor: const AlwaysStoppedAnimation(Color(0xFF16A34A)),
                  minHeight: 10,
                  borderRadius: BorderRadius.circular(5),
                ),
                const SizedBox(height: 4),
                const Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text('680 000 000 FCFA levés', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text('68% financé', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                ]),
                const SizedBox(height: 24),
              ]),
            ),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () => _showInvestSheet(context),
            child: const Text('Investir maintenant'),
          ),
        ),
      ),
    );
  }

  Widget _statBox(String label, String value, Color color) => Expanded(
    child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
      child: Column(children: [
        Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: color, fontSize: 13)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ]),
    ),
  );

  void _showInvestSheet(BuildContext context) {
    final ctrl = TextEditingController(text: '50000');
    showModalBottomSheet(context: context, isScrollControlled: true, shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Padding(
        padding: EdgeInsets.only(left: 24, right: 24, top: 24, bottom: MediaQuery.of(context).viewInsets.bottom + 24),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          const Text('Investir dans ce projet', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 16),
          TextField(controller: ctrl, keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Montant (FCFA)', prefixIcon: Icon(Icons.attach_money))),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: () { Navigator.pop(context); }, child: const Text('Confirmer l\'investissement')),
        ]),
      ),
    );
  }
}
