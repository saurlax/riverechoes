export function speak(msg: string) {
  const utterance = new SpeechSynthesisUtterance(msg);
  speechSynthesis.speak(utterance);
}
