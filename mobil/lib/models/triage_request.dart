class TriageRequest {
  final String fullName;
  final String nationalId;
  final List<String> symptoms;
  final int? birthYear;
  final String? gender; // E / K
  final String? chiefComplaint;

  const TriageRequest({
    required this.fullName,
    required this.nationalId,
    required this.symptoms,
    this.birthYear,
    this.gender,
    this.chiefComplaint,
  });

  Map<String, dynamic> toJson() => {
        'fullName': fullName,
        'tc': nationalId,
        'symptoms': symptoms,
        if (birthYear != null) 'birthYear': birthYear,
        if (gender != null && gender!.isNotEmpty) 'gender': gender,
        if (chiefComplaint != null && chiefComplaint!.isNotEmpty)
          'chiefComplaint': chiefComplaint,
      };
}

