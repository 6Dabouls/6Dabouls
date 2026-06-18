class Project {
  final String id;
  final String name;
  final String description;
  final String country;
  final String region;
  final String city;
  final String energyType;
  final String status;
  final String riskLevel;
  final double totalBudget;
  final double targetAmount;
  final double raisedAmount;
  final double expectedReturn;
  final int durationMonths;
  final double fundingProgress;
  final double minimumInvestment;
  final String currency;
  final List<String> images;
  final int investorCount;
  final bool isFeatured;
  final String createdAt;

  const Project({
    required this.id,
    required this.name,
    required this.description,
    required this.country,
    required this.region,
    required this.city,
    required this.energyType,
    required this.status,
    required this.riskLevel,
    required this.totalBudget,
    required this.targetAmount,
    required this.raisedAmount,
    required this.expectedReturn,
    required this.durationMonths,
    required this.fundingProgress,
    required this.minimumInvestment,
    required this.currency,
    required this.images,
    required this.investorCount,
    required this.isFeatured,
    required this.createdAt,
  });

  factory Project.fromJson(Map<String, dynamic> json) => Project(
    id: json['id'],
    name: json['name'],
    description: json['description'] ?? '',
    country: json['country'] ?? '',
    region: json['region'] ?? '',
    city: json['city'] ?? '',
    energyType: json['energyType'] ?? 'solar',
    status: json['status'] ?? 'active',
    riskLevel: json['riskLevel'] ?? 'medium',
    totalBudget: double.tryParse(json['totalBudget']?.toString() ?? '0') ?? 0,
    targetAmount: double.tryParse(json['targetAmount']?.toString() ?? '0') ?? 0,
    raisedAmount: double.tryParse(json['raisedAmount']?.toString() ?? '0') ?? 0,
    expectedReturn: double.tryParse(json['expectedReturn']?.toString() ?? '0') ?? 0,
    durationMonths: json['durationMonths'] ?? 12,
    fundingProgress: double.tryParse(json['fundingProgress']?.toString() ?? '0') ?? 0,
    minimumInvestment: double.tryParse(json['minimumInvestment']?.toString() ?? '0') ?? 0,
    currency: json['currency'] ?? 'XOF',
    images: List<String>.from(json['images'] ?? []),
    investorCount: json['investorCount'] ?? 0,
    isFeatured: json['isFeatured'] ?? false,
    createdAt: json['createdAt'] ?? DateTime.now().toIso8601String(),
  );

  String get energyEmoji {
    switch (energyType) {
      case 'solar': return '☀️';
      case 'wind': return '💨';
      case 'hydro': return '💧';
      case 'biomass': return '🌿';
      default: return '⚡';
    }
  }
}
