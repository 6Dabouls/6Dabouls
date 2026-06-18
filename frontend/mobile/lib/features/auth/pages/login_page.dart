import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true;
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 40),
              Row(children: [
                Container(width: 36, height: 36, decoration: BoxDecoration(
                  color: theme.colorScheme.primary, borderRadius: BorderRadius.circular(10)),
                  child: const Icon(Icons.eco, color: Colors.white, size: 20)),
                const SizedBox(width: 10),
                const Text('GreenInvest', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              ]),
              const SizedBox(height: 40),
              Text('Connexion', style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('Accédez à votre espace investisseur', style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey)),
              const SizedBox(height: 32),
              TextField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(labelText: 'Email', prefixIcon: Icon(Icons.email_outlined)),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _passCtrl,
                obscureText: _obscure,
                decoration: InputDecoration(
                  labelText: 'Mot de passe',
                  prefixIcon: const Icon(Icons.lock_outlined),
                  suffixIcon: IconButton(
                    icon: Icon(_obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Align(alignment: Alignment.centerRight,
                child: TextButton(onPressed: () {}, child: const Text('Mot de passe oublié ?'))),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loading ? null : () async {
                  setState(() => _loading = true);
                  await Future.delayed(const Duration(seconds: 1));
                  setState(() => _loading = false);
                  if (mounted) context.go('/dashboard');
                },
                child: _loading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Se connecter'),
              ),
              const SizedBox(height: 16),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Text("Pas encore de compte ? "),
                TextButton(onPressed: () => context.go('/register'), child: const Text("S'inscrire")),
              ]),
            ],
          ),
        ),
      ),
    );
  }
}
