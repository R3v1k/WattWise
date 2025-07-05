#Quality Attribute Scenarios

##Functional Suitability(Accuracy)

###Why it matters:
Accurate cost and energy projections are critical for customers making investment decisions. Even small miscalculations can lead to over-budgeting or underestimating savings, undermining trust and ROI calculations.

###Quality Attribute Scenario:
• Source of stimulus: Internal analysis module
• Stimulus: Batch of 100 actual building usage datasets with known benchmark values
• Environment: Staging environment, CPU 4 cores, 8 GB RAM
• Artifact: Estimation engine component
• Response: Calculate projected annual energy use and cost savings
• Response measure: 95% of estimates within ±2% of benchmark values

###Execution:
Run an automated test suite using pytest that feeds the engine 100 benchmark datasets (stored in tests/benchmarks/). The test asserts deviation ≤2% for at least 95 datasets.

##Performance Efficiency (Time Behavior)

###Why it matters:
Fast computations enable users to iterate through multiple scenarios without delay, improving engagement and decision velocity.

###Quality Attribute Scenario:
• Stimulus source: End user GUI module
• Stimulus: Asking to generate a new estimate with user-specified inputs
• Environment: Production-style hardware (4 vCPU, 16 GB RAM) under 50 concurrent sessions
• Artifact: Complete estimation process (API call via UI)
• Response: Return estimation results to the UI
• Response measure: 95% of requests complete in ≤ 3 seconds

###Execution:
Use JMeter to simulate 50 concurrent users sending HTTP POST requests to /api/estimate with a representative payload. Collect timing metrics and verify 95% of response times are ≤3 s.

##Usability(Understandability)

###Why it matters:
Non-technical stakeholders (e.g., facility managers) must quickly interpret assumptions, inputs, and outputs. Clear presentation reduces support calls and decision time.

###Quality Attribute Scenario:
• Source of stimulus: New application user
• Stimulus: Navigate to results page from estimate
• Environment: Guided onboarding tutorial enabled
• Artifact: Results dashboard UI
• Response: User discovers input assumptions, results breakdown, and tooltips in < 2 minutes
• Response measure: 90% of new users complete the task in ≤ 2 minutes with ≤ 3 help tooltip clicks

###Execution:
Conduct a usability study with 10 non-technical participants. Record screen interactions and time to locate key UI elements. Confirm at least 9 participants meet the criteria.
