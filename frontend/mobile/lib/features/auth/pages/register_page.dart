import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RegisterPage extends StatelessWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Créer un compte')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(children: [
          const TextField(decoration: InputDecoration(labelText: 'Prénom')),
          const SizedBox(height: 12),
          const TextField(decoration: InputDecoration(labelText: 'Nom')),
          const SizedBox(height: 12),
          const TextField(keyboardType: TextInputType.emailAddress, decoration: InputDecoration(labelText: 'Email')),
          const SizedBox(height: 12),
          const TextField(keyboardType: TextInputType.phone, decoration: InputDecoration(labelText: 'Téléphone')),
          const SizedBox(height: 12),
          const TextField(obscureText: true, decoration: InputDecoration(labelText: 'Mot de passe')),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.go('/dashboard'),
            child: const Text('Créer mon compte'),
          ),
          TextButton(onPressed: () => context.go('/login'), child: const Text('Déjà un compte ? Se connecter')),
        ]),
      ),
    );
  }
}
