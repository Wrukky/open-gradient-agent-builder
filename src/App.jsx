import { useState } from "react";

const MODELS = [
  { name: "GPT-4.1", color: "#10b981" },
  { name: "Claude Sonnet", color: "#f97316" },
  { name: "Grok", color: "#ef4444" },
  { name: "Gemini", color: "#6366f1" }
];

function Step({ step, onChange, onDelete }) {
  const modelMeta = MODELS.find(m => m.name === step.model);

  return (
    <div style={{
      border: `1px solid ${modelMeta.color}55`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      background: `${modelMeta.color}11`,
      position: "relative"
    }}>
      
      {/* Arrow */}
      <div style={{
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: 18,
        opacity: 0.3
      }}>↓</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <select
          value={step.model}
          onChange={(e) => onChange(step.id, { model: e.target.value })}
          style={{ padding: 6 }}
        >
          {MODELS.map(m => (
            <option key={m.name}>{m.name}</option>
          ))}
        </select>

        <button onClick={() => onDelete(step.id)}>✕</button>
      </div>

      <input
        value={step.task}
        onChange={(e) => onChange(step.id, { task: e.target.value })}
        placeholder="What should this model do?"
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.3)",
          color: "white"
        }}
      />

      {step.output && (
        <div style={{
          marginTop: 10,
          fontSize: 13,
          opacity: 0.7
        }}>
          Output: {step.output}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [steps, setSteps] = useState([
    { id: 1, model: "GPT-4.1", task: "", output: "" }
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now(),
        model: "GPT-4.1",
        task: "",
        output: ""
      }
    ]);
  };

  const updateStep = (id, changes) => {
    setSteps(steps.map(s =>
      s.id === id ? { ...s, ...changes } : s
    ));
  };

  const deleteStep = (id) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const runAgent = () => {
    let previousOutput = "User input";

    const newSteps = steps.map((step, i) => {
      const output = `Step ${i + 1}: ${step.model} processed "${step.task}" → based on "${previousOutput}"`;
      previousOutput = output;
      return { ...step, output };
    });

    setSteps(newSteps);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 40 }}>
      
      <h1 style={{ textAlign: "center" }}>
        🧠 OpenGradient Agent Builder
      </h1>

      <p style={{ textAlign: "center", opacity: 0.6 }}>
        Chain multiple AI models into a pipeline
      </p>

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

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={addStep}>+ Add Step</button>
        <button onClick={runAgent}>▶ Run Agent</button>
      </div>
    </div>
  );
}
