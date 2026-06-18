import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class TwoFactorPage extends StatelessWidget {
  const TwoFactorPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Vérification 2FA')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const Icon(Icons.security, size: 64, color: Color(0xFF16A34A)),
          const SizedBox(height: 16),
          const Text('Entrez le code de votre application', textAlign: TextAlign.center),
          const SizedBox(height: 24),
          const TextField(
            keyboardType: TextInputType.number,
            maxLength: 6,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 24, letterSpacing: 8),
            decoration: InputDecoration(labelText: 'Code 6 chiffres'),
          ),
          const SizedBox(height: 24),
          ElevatedButton(onPressed: () => context.go('/dashboard'), child: const Text('Vérifier')),
        ]),
      ),
    );
  }
}
