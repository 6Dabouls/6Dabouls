import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({super.key});
  @override
  State<ProjectsPage> createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> {
  final _search = TextEditingController();
  String _selectedType = 'all';

  final _types = [
    ('all', 'Tous'), ('solar', '☀️ Solaire'), ('wind', '💨 Éolien'),
    ('hydro', '💧 Hydraulique'), ('biomass', '🌿 Biomasse'),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalogue des projets'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(110),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Column(children: [
              TextField(
                controller: _search,
                decoration: InputDecoration(
                  hintText: 'Rechercher...',
                  prefixIcon: const Icon(Icons.search),
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  filled: true,
                  fillColor: Colors.grey.shade100,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(height: 36, child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _types.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (_, i) {
                  final selected = _types[i].$1 == _selectedType;
                  return FilterChip(
                    label: Text(_types[i].$2),
                    selected: selected,
                    onSelected: (_) => setState(() => _selectedType = _types[i].$1),
                  );
                },
              )),
            ]),
          ),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 6,
        itemBuilder: (ctx, i) => _ProjectCard(index: i, onTap: () => ctx.go('/projects/project-$i')),
      ),
    );
  }
}

class _ProjectCard extends StatelessWidget {
  final int index;
  final VoidCallback onTap;
  const _ProjectCard({required this.index, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = [
      ('Centrale Solaire Yamoussoukro', '☀️', '9.5', 0.68, 'Côte d\'Ivoire', 'Faible'),
      ('Parc Éolien Dakar', '💨', '8.2', 0.45, 'Sénégal', 'Moyen'),
      ('Micro-hydro Cameroun', '💧', '11.0', 0.30, 'Cameroun', 'Moyen'),
      ('Biomasse Mali Nord', '🌿', '7.5', 0.82, 'Mali', 'Faible'),
      ('Solaire Bamako Est', '☀️', '10.2', 0.55, 'Mali', 'Faible'),
      ('Éolien Ghana Côte', '💨', '9.0', 0.20, 'Ghana', 'Élevé'),
    ];
    if (index >= items.length) return const SizedBox();
    final (name, emoji, ret, progress, country, risk) = items[index];

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Text(emoji, style: const TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text('📍 $country', style: const TextStyle(color: Colors.grey, fontSize: 12)),
              ])),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(8)),
                  child: Text('$ret%/an', style: const TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 12))),
                const SizedBox(height: 4),
                Text('Risque: $risk', style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ]),
            ]),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.grey.shade200,
              valueColor: AlwaysStoppedAnimation(theme.colorScheme.primary),
              borderRadius: BorderRadius.circular(4),
              minHeight: 8,
            ),
            const SizedBox(height: 4),
            Text('${(progress * 100).toInt()}% financé', style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ]),
        ),
      ),
    );
  }
}
