Part of the [Industrial Control System Digital Twin](../) project, for one of my Year-2 engineering project modules on the control, instrumentation, and automation systems for a conceptual autonomous underwater habitat.

The power chain models a three-phase AC source through a six-diode rectifier down to a 24V DC instrumentation bus, achieving 96.7% simulated efficiency with a full component-level loss breakdown validated against hand calculations.

![Model:](./images/electrical_diagram.png)

Rather than modelling every sensor at component level, the simulation uses a deliberate abstraction strategy required for the assignment: each sensor tier is aggregated into a single equivalent resistive load block in Simscape, with resistance calculated from

$$
R=\frac{V^2}{P_{\mathrm{nom}}}
$$

at the 24 V DC bus. This allows the full 74-channel sensor network to be represented realistically in terms of power consumption without the computational overhead of 74 individual signal chains.

I referenced my load values from real hardware datasheets. PLC power budgets are taken directly from the Siemens S7-1200 System Manual V4.3 Tables A-47 and A-52, docking loads from the Atlas Copco LT5-15 and Blue Logic Subsea-USB product catalogues, and sensor power values are derived uniformly from the ISA-5.1 4–20 mA standard, giving

$$
P_{\max}=24,\mathrm{V}\times20,\mathrm{mA}=480,\mathrm{mW}
$$

per standard channel, with justified exceptions for bridge sensors, FBG interrogators, and discrete sensors.

The highlight of this model is a custom PID controller, written from scratch as a MATLAB Function block, which continuously regulates the Buck converter output voltage by computing incremental duty cycle adjustments rather than absolute values — a deliberate design choice that inherently avoids the integral accumulation behaviour encountered with positional PID implementations, eliminating the need for explicit anti-windup clamping.

The final controller achieves approximately ten times better voltage regulation than the open-loop converter with no efficiency penalty, and the iterative process of developing it is one of the most interesting parts of the project, demonstrating how simulation forces you to engage with implementation challenges that pure analytical calculations rarely expose.

One unexpected discovery arose during model validation: the Simscape three-phase voltage source uses internal modelling assumptions that differ from the simplified textbook rectifier equations, meaning the theoretical 284 V source setting did not produce the expected DC output. The correct value was determined through empirical iteration to achieve the required operating point. This proved to be a valuable reminder that successful model-based engineering requires validating theoretical calculations against the behaviour of the simulation itself, highlighting how digital twins can reveal practical implementation differences that traditional hand calculations alone may overlook.
