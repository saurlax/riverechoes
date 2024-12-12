export default defineNuxtPlugin(nuxtApp => {
    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance();
            msg.text = text;
            window.speechSynthesis.speak(msg);
        } else {
            console.error('语音合成功能在此浏览器中不可用');
        }
    };

    // 将 speak 方法添加到 nuxtApp 上，可以通过 $speak 调用
    nuxtApp.provide('speak', speak);
});
