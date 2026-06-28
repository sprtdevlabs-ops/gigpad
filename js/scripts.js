class ChordProConverter {
  // Accepts real-world chords (much looser but still safe)
  static CHORD_REGEX =
    /^[A-G](#|b)?(m|maj|min|dim|aug|sus\d*)?(\d+)?(\/[A-G](#|b)?)?$/i;

  static isChordToken(token) {
    return ChordProConverter.CHORD_REGEX.test(token.trim());
  }

  // More reliable chord line detection
  static isChordLine(line) {
    if (!line || !line.trim()) return false;

    const tokens = line.trim().split(/\s+/);
    let chordCount = 0;

    for (const t of tokens) {
      if (ChordProConverter.isChordToken(t)) chordCount++;
    }

    // at least 60% chords OR at least 2 chord tokens
    return chordCount >= 2 || chordCount / tokens.length >= 0.6;
  }

  static convertToChordPro(text) {
    if (!text) return "";

    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const result = [];

    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const next = lines[i + 1];

      if (
        next &&
        ChordProConverter.isChordLine(line) &&
        !ChordProConverter.isChordLine(next)
      ) {
        result.push(ChordProConverter.merge(line, next));
        i += 2;
      } else {
        result.push(line);
        i++;
      }
    }

    return result.join("\n");
  }

  static merge(chordLine, lyricLine) {
    let merged = "";
    let pos = 0;

    const regex = /\S+/g;
    let match;

    while ((match = regex.exec(chordLine)) !== null) {
      const chord = match[0];
      const index = match.index;

      while (pos < index && pos < lyricLine.length) {
        merged += lyricLine[pos++];
      }

      merged += `[${chord}]`;
    }

    if (pos < lyricLine.length) {
      merged += lyricLine.slice(pos);
    }

    return merged;
  }
}

// ---------------- UI FIXES ----------------

function handleConversion() {
  try {
    const input = document.getElementById("input").value;

    const normalized = input.replace(/\r\n/g, "\n").replace(/\u00a0/g, " ");

    document.getElementById("output").value =
      ChordProConverter.convertToChordPro(normalized);
  } catch (err) {
    console.error("Conversion error:", err);
  }
}

function clearFields() {
  document.getElementById("input").value = "";
  document.getElementById("output").value = "";
}

function copyToClipboard() {
  const output = document.getElementById("output");
  if (!output.value) return;

  navigator.clipboard.writeText(output.value);

  // lightweight feedback (no annoying alert)
  const btn = document.getElementById("copyBtn");
  const old = btn.textContent;

  btn.textContent = "Copied!";
  setTimeout(() => (btn.textContent = old), 1200);
}
