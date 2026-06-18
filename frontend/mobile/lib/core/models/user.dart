class User {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? country;
  final String? profilePicture;
  final String role;
  final String kycStatus;
  final bool emailVerified;
  final bool twoFactorEnabled;
  final double walletBalance;
  final bool isActive;

  const User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.country,
    this.profilePicture,
    required this.role,
    required this.kycStatus,
    required this.emailVerified,
    required this.twoFactorEnabled,
    required this.walletBalance,
    required this.isActive,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'],
    email: json['email'],
    firstName: json['firstName'],
    lastName: json['lastName'],
    phone: json['phone'],
    country: json['country'],
    profilePicture: json['profilePicture'],
    role: json['role'],
    kycStatus: json['kycStatus'],
    emailVerified: json['emailVerified'] ?? false,
    twoFactorEnabled: json['twoFactorEnabled'] ?? false,
    walletBalance: double.tryParse(json['walletBalance']?.toString() ?? '0') ?? 0,
    isActive: json['isActive'] ?? true,
  );

  String get fullName => '$firstName $lastName';
  String get initials => '${firstName[0]}${lastName[0]}';
}
