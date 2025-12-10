class TriageResponse {
  final int? urgencyLevel;
  final String? urgencyLabel;
  final String? responseText;
  final int? queueNumber;
  final String? reasoning;
  final int? estimatedWaitMinutes;
  final String? status;
  final int? waitingAhead;
  final String? patientName;
  final String? message;

  const TriageResponse({
    this.urgencyLevel,
    this.urgencyLabel,
    this.responseText,
    this.queueNumber,
    this.reasoning,
    this.estimatedWaitMinutes,
    this.status,
    this.waitingAhead,
    this.patientName,
    this.message,
  });

  factory TriageResponse.fromJson(Map<String, dynamic> json) => TriageResponse(
        urgencyLevel: _asInt(json['urgencyLevel'] ?? json['urgency_level']),
        urgencyLabel:
            (json['urgencyLabel'] ?? json['urgency_label'])?.toString(),
        responseText:
            (json['responseText'] ?? json['response'] ?? json['message'])
                ?.toString(),
        queueNumber: _asInt(json['queueNumber'] ?? json['queue_number']),
        reasoning: json['reasoning']?.toString(),
        estimatedWaitMinutes: _asInt(
            json['estimatedWaitMinutes'] ?? json['estimated_wait_minutes']),
        status: json['status']?.toString(),
        waitingAhead: _asInt(json['waitingAhead'] ?? json['waiting_ahead']),
        patientName: json['patientName']?.toString(),
        message: json['message']?.toString(),
      );

  static int? _asInt(dynamic v) {
    if (v == null) return null;
    if (v is int) return v;
    if (v is num) return v.toInt();
    final parsed = int.tryParse(v.toString());
    return parsed;
  }
}

