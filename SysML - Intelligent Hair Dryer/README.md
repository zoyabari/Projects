# SysML v2 System Design — Intelligent Hair Dryer

For a multidisciplinary systems and software engineering module, I built a SysML v2 model of the "Intelligent Hair Drying/Styling System" described in patent US 12,178,303 B2 (Spur Concepts Inc.), using the open-source tool Gaphor v3.2.0.

The patent describes a hybrid heating system (quartz infrared bulb + nichrome wire heater) that adapts to hair characteristics using a contactless infrared temperature sensor and a 9-axis IMU, all controlled by an ARM Cortex-M3 running an RTOS with Wi-Fi/Bluetooth sync.

## What I modelled

**Requirements Diagram** — Functions and non-functional requirements extracted from the patent's "Summary of the Invention" and "Detailed Description," linked to structural elements through containment, derivation, and satisfaction relationships. I colour-coded the hierarchy: purple for main functional requirements, pink for their sub-requirements, blue for NFRs, and baby blue for derived requirements.

**Block Definition Diagram (BDD)** — A structural breakdown of the system built from close analysis of the patent's diagrams and detailed description, colour-coded by subsystem. Gaphor doesn't support SysML v2's dotted-line usage/dependency notation, so I used direct association arrows instead, inferring relationships from how the system actually operates (e.g. linking Logging to NVRAM, and the Control Algorithm to sensors/heating/UI).

**Activity Diagram** — The control loop's behavioural logic, synthesised from the patent's queue structure (Fig. 7) and timer module (Fig. 8) rather than modelled as a simple linear flow. Swimlanes split responsibility across Sensors, Control Algorithm, and Actuators.

## Reference

Goldman, R., Friedman, J. and Rattner, Z. (2024). *System and Method for an Enhanced Hair Dryer.* U.S. Patent 12,178,303 B2. Available at: https://patents.google.com/patent/US12178303B2

*(Diagrams to follow.)*
