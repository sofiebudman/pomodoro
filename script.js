$(document).ready(function(){
	var count = minutesToSeconds(parseInt($("#workMinutes").val()) || 25);
	var breakTime = minutesToSeconds(parseInt($("#breakMinutes").val()) || 5);
	var timerInterval;
	var isRunning = false;
	var isBreakMode = false;
 
    $("#reset").hide();
    $("#break").hide(); // Hide break timer initially
    $("#breakInput").hide();
    updateDisplay();
    validateInputs(); // Check initial state

    // Add click handlers for start and reset buttons
    $("#start").click(function() {
        startTimer();
    });

    $("#reset").click(function() {
        resetTimer();
    });

    // Convert minutes to seconds
    function minutesToSeconds(minutes) {
        return minutes * 60;
    }

    // Convert seconds to MM:SS format
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function switchMode() {
        isBreakMode = !isBreakMode;
        if (isBreakMode) {
            $("#timeDiv").hide();
            $("#break").show();
            $("#workInput").hide();
            $("#breakInput").show();
            count = breakTime;
            $("body").addClass("break-mode");
        } else {
            $("#break").hide();
            $("#timeDiv").show();
            $("#breakInput").hide();
            $("#workInput").show();
            count = minutesToSeconds(parseInt($("#workMinutes").val()));
            $("body").removeClass("break-mode");
        }
        updateDisplay();
    }

    // Start the timer
    function startTimer() {
        if (!isRunning && count > 0) {
            isRunning = true;
            $("#workMinutes, #breakMinutes").prop('disabled', true);
            $("#start").prop('disabled', true);
            
            const currentTimer = isBreakMode ? "#break::after" : "#timeDiv::after";
            $(currentTimer).css({
                'animation-duration': `${count}s`,
                'animation-play-state': 'running'
            });

            timerInterval = setInterval(function() {
                if (count > 0) {
                    count--;
                    updateDisplay();
                } else {
                    stopTimer();
                    playAlarm();
                    switchMode();
                    validateInputs(); // Enable start button for next session
                }
            }, 1000);
            $("#reset").show();
        }
    }

    // Stop the timer
    function stopTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        $("#workMinutes, #breakMinutes").prop('disabled', false);
        $(isBreakMode ? "#break::after" : "#timeDiv::after").css('animation-play-state', 'paused');
        validateInputs();
    }

    // Reset the timer
    function resetTimer() {
        stopTimer();
        isBreakMode = false;
        $("body").removeClass("break-mode");
        $("#break").hide();
        $("#timeDiv").show();
        count = minutesToSeconds(parseInt($("#workMinutes").val()));
        updateDisplay();
        $("#reset").hide();
        $("#timeDiv::after, #break::after").css({
            'animation-duration': '0s',
            'transform': 'rotate(-45deg)'
        });
    }

    // Update the display
    function updateDisplay() {
        if (isBreakMode) {
            $("#breakNum").html(formatTime(count));
        } else {
            $("#num").html(formatTime(count));
        }
    }

    // Play alarm sound when timer ends
    function playAlarm() {
        const audio = new Audio('path/to/alarm-sound.mp3');
        audio.play();
    }

    function validateInputs() {
        const workVal = parseInt($("#workMinutes").val());
        const breakVal = parseInt($("#breakMinutes").val());
        const isValid = !isNaN(workVal) && !isNaN(breakVal) && 
                       workVal >= 1 && workVal <= 60 && 
                       breakVal >= 1 && breakVal <= 60;
        $("#start").prop('disabled', !isValid || isRunning);
    }

    // Handle work time input changes
    $("#workMinutes").on('change keyup input', function() {
        if (!isRunning) {
            let minutes = parseInt($(this).val());
            if (isNaN(minutes)) {
                $(this).val('');
                validateInputs();
                return;
            }
            if (minutes) {
                minutes = Math.min(Math.max(minutes, 1), 60);
                $(this).val(minutes);
                count = minutesToSeconds(minutes);
                updateDisplay();
            }
            validateInputs();
        }
    });

    // Handle break time input changes
    $("#breakMinutes").on('change keyup input', function() {
        if (!isRunning) {
            let minutes = parseInt($(this).val());
            if (isNaN(minutes)) {
                $(this).val('');
                validateInputs();
                return;
            }
            if (minutes) {
                minutes = Math.min(Math.max(minutes, 1), 60);
                $(this).val(minutes);
                breakTime = minutesToSeconds(minutes);
                if (isBreakMode) {
                    count = breakTime;
                    updateDisplay();
                }
            }
            validateInputs();
        }
    });

    // Add blur handlers to ensure valid values when focus leaves input
    $("#workMinutes, #breakMinutes").on('blur', function() {
        if (!$(this).val()) {
            if (this.id === 'workMinutes') {
                $(this).val('25');
                count = minutesToSeconds(25);
            } else {
                $(this).val('5');
                breakTime = minutesToSeconds(5);
            }
            updateDisplay();
            validateInputs();
        }
    });
});

