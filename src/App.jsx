import { useState } from "react";

const MODELS = [
  { name: "GPT-4.1", color: "#10b981" },
  { name: "Claude Sonnet", color: "#f97316" },
  { name: "Grok", color: "#ef4444" },
  { name: "Gemini", color: "#6366f1" }
];

function simulateModel(model, task, input) {
  if (model === "Grok") {
    return `Analysis: Based on "${input}", market indicators suggest mixed momentum. Task executed: ${task}`;
  }
  if (model === "Claude Sonnet") {
    return `Structured Report:\nTask: ${task}\nSummary of previous step: ${input}`;
  }
  if (model === "Gemini") {
    return `Research Insight: After evaluating "${input}", findings relate to: ${task}`;
  }
  return `Result: ${task} completed using context "${input}"`;
}

function Step({ step, onChange, onDelete }) {
  const modelMeta = MODELS.find(m => m.name === step.model);

  return (
    <div
      style={{
        border: `1px solid ${modelMeta.color}55`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        background: `${modelMeta.color}11`,
        position: "relative"
      }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <select
          value={step.model}
          onChange={(e) => onChange(step.id, { model: e.target.value })}
        >
          {MODELS.map(m => (
            <option key={m.name}>{m.name}</option>
          ))}
        </select>

        <button onClick={() => onDelete(step.id)}>Delete</button>
      </div>

      <input
        value={step.task}
        onChange={(e) => onChange(step.id, { task: e.target.value })}
        placeholder="Task for this model"
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.3)",
          color: "white"
        }}
      />

      {step.running && (
        <div style={{ marginTop: 10, opacity: 0.6 }}>
          Running...
        </div>
      )}

      {step.output && (
        <div
          style={{
            marginTop: 10,
            fontSize: 13,
            background: "rgba(0,0,0,0.4)",
            padding: 10,
            borderRadius: 6
          }}
        >
          {step.output}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState([
    { id: 1, model: "GPT-4.1", task: "", output: "", running: false }
  ]);
  const [running, setRunning] = useState(false);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now(),
        model: "GPT-4.1",
        task: "",
        output: "",
        running: false
      }
    ]);
  };

  const updateStep = (id, changes) => {
    setSteps(steps.map(s => (s.id === id ? { ...s, ...changes } : s)));
  };

  const deleteStep = (id) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const runAgent = async () => {
    if (running) return;
    setRunning(true);

    let previousOutput = input || "User input";

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      setSteps(prev =>
        prev.map(s =>
          s.id === step.id ? { ...s, running: true } : s
        )
      );

      await new Promise(r => setTimeout(r, 1200));

      const result = simulateModel(step.model, step.task, previousOutput);
      previousOutput = result;

      setSteps(prev =>
        prev.map(s =>
          s.id === step.id
            ? { ...s, output: result, running: false }
            : s
        )
      );
    }

    setRunning(false);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 40 }}>
      <h1 style={{ textAlign: "center" }}>
        OpenGradient Agent Builder
      </h1>

      <p style={{ textAlign: "center", opacity: 0.7 }}>
        Build multi-model AI workflows
      </p>

      <textarea
        placeholder="Enter input for the agent..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 12,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.4)",
          color: "white"
        }}
      />

      <div style={{ marginTop: 30 }}>
        {steps.map(step => (
          <Step
            key={step.id}
            step={step}
            onChange={updateStep}
            onDelete={deleteStep}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={addStep}>Add Step</button>
        <button onClick={runAgent}>
          {running ? "Running..." : "Run Agent"}
        </button>
      </div>
    </div>
  );
}
