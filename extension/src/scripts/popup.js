document.addEventListener('DOMContentLoaded', () => {
    const focusTopic1Input = document.getElementById('focus_topic_1');
    const focusPoint2Input = document.getElementById('focus_point_2');
    const focusPoint3Input = document.getElementById('focus_point_3');
    const startFocusButton = document.getElementById('set-focus-btn');

    if (!focusTopic1Input || !focusPoint2Input || !focusPoint3Input || !startFocusButton) {
        console.error('One or more input elements or the button not found in the DOM.');
        return;
    }

    startFocusButton.addEventListener('click', () => {
        const focus_topic_1 = focusTopic1Input.value;
        const focus_point_2 = focusPoint2Input.value;
        const focus_point_3 = focusPoint3Input.value;

        chrome.storage.local.set({ focus_topic_1, focus_point_2, focus_point_3 }, () => {
            console.log('Focus points stored:', { focus_topic_1, focus_point_2, focus_point_3 });
            alert('Focus points saved!'); 
        });
    });
});
