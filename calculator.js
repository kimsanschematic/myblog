var maxRows = 6 + 1;
var i = 0;
var cells = new Array(maxRows);
initialise();

function initialise() {
    for (var i = 0; i < maxRows; i++) {
        cells[i] = new row();
    }
}

function row() {
    this.SS = 0;
    this.HP = 0;
    this.SM = 0;
    this.RV = 0;
    this.PC = 0;
    this.SV = 0;
    this.RC = 0;
    this.SC = 0;
}

function calcRV(hp) {
    if (0 < hp && hp < 50) {
        return 1.5;
    } else if (50 <= hp && hp < 100) {
        return 1.4;
    } else if (hp >= 100) {
        return 1.3;
    }
    return 1.5;
}

function calcPC(hp) {
    return (hp * calcRV(hp));
}

function calcSV(hp, sm) {
    var sv;
    if (0 < hp && hp <= 30) {
        sv = 7;
    } else if (30 < hp && hp < 100) {
        sv = 6;
    } else if (100 <= hp) {
        sv = 5;
}}
    //  Star Delta or DOLif (sm==false){return sv/2;}else{return sv;}}function calcRC(hp, prev){return (prev + calcPC(hp));}function calcSC(hp, prev, sm){return ((calcPC(hp) * calcSV(hp, sm)) + prev);}function CheckKVA(input) {if (input.value == "" ){alert("Kilo Volt Ampheres are required for calculation.");return false;} if (input.value < 1 || input.value > 100000 ) { input.value = "*ERR*"; } return; } function CheckPhase(input) {   if (input.value == "" ){alert("Phase are required for calculation.");return false;}  if (input.value < 1 || input.value > 5 ) { input.value = "*ERR*"; }   return; }  function CheckVolts(input) { if (input.value == "" ){alert("Volts are required for calculation.");return false;}if (input.value < 1 || input.value > 100000) { input.value = "*ERR*"; } return; }  function CalcKVA(form,Volts,KVA,Phase) {   var E = parseInt(Volts);   var K = parseInt(KVA);   var P = parseInt(Phase);   var A = 0;    if (P == 1)  {A = ((K * 1000)/E);   }  else if (P == 2 || P == 4)  {A = ((K * 1000)/(2*E));   }  else if (P == 3)  {A = ((K * 1000)/(1.73*E));   }  return(A); }  function computeForm(form) {     if ((form.volts.value == null || form.volts.value.length == 0))     {         return;     }      var E = form.volts.value;     var K = form.kva.value;     var P = form.phase1.value;    var A = 0;    //alert("P is " + P);  A = CalcKVA(form, E, K, P);  form.Ampere.value = A;   return; } function computeKVAtoKW(form){    if ((form.kvain.value == null || form.kvain.value == 0))    {return;    }    var K = form.kvain.value;    var W = 0;    W = K * 0.8;    //alert(W)    form.kwout.value = W;    return;}function computeKWtoKVA(form){    if ((form.kwin.value == null || form.kwin.value == 0))    {    //alert("Hi");return;    }    var W = form.kwin.value;    var K = 0;    K = W / 0.8;    form.kvaout.value = K;    //alert(K);    return;}function computeKWtoHP(form){    if ((form.kwinHP.value == null || form.kwinHP.value == 0))    {return;    }    var W = form.kwinHP.value;    var H = 0;    H = W / 0.746;    form.hpout.value = H;    return;}function computeHPtoKVA(form){    if ((form.hpin.value == null || form.hpin.value == 0))    {return;    }    var H = form.hpin.value;    var K = 0;    var S = 1;    var R = 1;    if (H < 50)    {R = 1.5;    }    else if (H > 49 && H < 100)    {R = 1.4;    }    else if (H > 99)    {R = 1.3;S = 5;    }    if (H < 30)    {S = 7;    }    else if (H > 29 && H < 100)    {S = 6    }        K = ((H * R * S) / 2) / 1.39;        form.kvareq.value = K;    return;}function getValues(form){var i;for (i=1; i<maxRows; i++){cells[i].HP = eval("form.HP" + i + ".value");cells[i].SM = eval("form.SM" + i + "[0].checked");}}//  Counts the number of rows used (or motors)function countMotors(){var i = 1;var count=0;while (i<maxRows && cells[i].HP!="" && cells[i].HP!=0){count++;i++;}return count;}//  Prints an error messagefunction error(emsg){window.status = "## ERROR: " + emsg + " ##";setTimeout("clearError()", 5000);}//  Clears the status barfunction clearError(){window.status = "";}function evalGenSize(form){var hp;var phasemult=1.39;var count=0;getValues(form);count = countMotors();if (count==0){error("No motors entered.");}else{var rcprev = 0;var rcmax = 0;var scmax = 0;var kvaStart = 0;var kvaRunning = 0;var sm = 1;if (form.phase[1].checked){phasemult = 4.20;}else{phasemult = 1.39;}for (i=1; i<=count; i++){hp = cells[i].HP;sm = cells[i].SM;if (hp<0){error("Some HP values are negative.");}cells[i].RV = calcRV(hp);cells[i].PC = calcPC(hp);cells[i].SV = calcSV(hp, sm);cells[i].RC = calcRC(hp, rcprev);cells[i].SC = calcSC(hp, rcprev, sm);rcprev = cells[i].RC;if (rcprev > rcmax){rcmax = rcprev;}if (cells[i].SC > scmax){scmax = cells[i].SC;}}returnValues(form);kvaStart = scmax/phasemult/2;kvaRunning = rcmax/phasemult;recommended = 1.16*Math.max(kvaStart, kvaRunning);form.startwith.value = Math.round(kvaStart);form.runwith.value = Math.round(kvaRunning);form.recommend.value = Math.round(recommended);}}function returnValues(form){var i = 1;if (cells[i].SC!=0){form.RV1.value = cells[i].RV;form.PC1.value = Math.round(cells[i].PC);form.SV1.value = cells[i].SV;form.RC1.value = Math.round(cells[i].RC);form.SC1.value = Math.round(cells[i].SC);}i++;if (cells[i].SC!=0){form.RV2.value = cells[i].RV;form.PC2.value = Math.round(cells[i].PC);form.SV2.value = cells[i].SV;form.RC2.value = Math.round(cells[i].RC);form.SC2.value = Math.round(cells[i].SC);}i++;if (cells[i].SC!=0){form.RV3.value = cells[i].RV;form.PC3.value = Math.round(cells[i].PC);form.SV3.value = cells[i].SV;form.RC3.value = Math.round(cells[i].RC);form.SC3.value = Math.round(cells[i].SC);}i++;if (cells[i].SC!=0){form.RV4.value = cells[i].RV;form.PC4.value = Math.round(cells[i].PC);form.SV4.value = cells[i].SV;form.RC4.value = Math.round(cells[i].RC);form.SC4.value = Math.round(cells[i].SC);}i++;if (cells[i].SC!=0){form.RV5.value = cells[i].RV;form.PC5.value = Math.round(cells[i].PC);form.SV5.value = cells[i].SV;form.RC5.value = Math.round(cells[i].RC);form.SC5.value = Math.round(cells[i].SC);}i++;if (cells[i].SC!=0){form.RV6.value = cells[i].RV;form.PC6.value = Math.round(cells[i].PC);form.SV6.value = cells[i].SV;form.RC6.value = Math.round(cells[i].RC);form.SC6.value = Math.round(cells[i].SC);}i++;}function resetAllMotors(form){for (i=1; i<maxRows; i++){cells[i].HP = 0;cells[i].RC = 0;cells[i].SC = 0;}form.HP6.value = "";form.HP5.value = "";form.HP4.value = "";form.HP3.value = "";form.HP2.value = "";form.HP1.value = "";}

    var maxRows = 6 + 1;
    var i = 0;

    var cells = new Array(maxRows);

    initialise();

    function initialise() {
        for (var i = 0; i < maxRows; i++) {
            cells[i] = new row();
        }
    }

    function row() {
        this.SS = 0;
        this.HP = 0;
        this.SM = 0;
        this.RV = 0;
        this.PC = 0;
        this.SV = 0;
        this.RC = 0;
        this.SC = 0;
    }

    function calcRV(hp) {
        if (0 < hp && hp < 50) {
            return 1.5;
        } else if (50 <= hp && hp < 100) {
            return 1.4;
        } else if (hp >= 100) {
            return 1.3;
        }
        return 1.5;
    }

    function calcPC(hp) {
        return (hp * calcRV(hp));
    }

    function calcSV(hp, sm) {
        var sv;

        if (0 < hp && hp <= 30) {
            sv = 7;
        } else if (30 < hp && hp < 100) {
            sv = 6;
        } else if (100 <= hp) {
            sv = 5;
        }
        //  Star Delta or DOL
        if (sm == false) {
            return sv / 2;
        } else {
            return sv;
        }
    }

    function calcRC(hp, prev) {
        return (prev + calcPC(hp));
    }

    function calcSC(hp, prev, sm) {
        return ((calcPC(hp) * calcSV(hp, sm)) + prev);
    }

    function CheckKVA(input) {
        if (input.value == "") {
            alert("Kilo Volt Ampheres are required for calculation.");
            return false;
        }

        if (input.value < 1 || input.value > 100000) {
            input.value = "*ERR*";
        }
        return;
    }

    function CheckPhase(input) {
        if (input.value == "") {
            alert("Phase are required for calculation.");
            return false;
        }
        if (input.value < 1 || input.value > 5) {
            input.value = "*ERR*";
        }
        return;
    }

    function CheckVolts(input) {
        if (input.value == "") {
            alert("Volts are required for calculation.");
            return false;
        }

        if (input.value < 1 || input.value > 100000) {
            input.value = "*ERR*";
        }
        return;
    }

    function CalcKVA(form, Volts, KVA, Phase) {
        var E = parseInt(Volts);
        var K = parseInt(KVA);
        var P = parseInt(Phase);

        var A = 0;

        if (P == 1) {
            A = ((K * 1000) / E);
        } else if (P == 2 || P == 4) {
            A = ((K * 1000) / (2 * E));
        } else if (P == 3) {
            A = ((K * 1000) / (1.73 * E));
        }
        return (A);
    }

    function CalcPowerAmp(form, Phase, VoltsReq, Amperes, PowerFactor) {
        var P = parseInt(Phase);
        var V = parseInt(VoltsReq);
        var M = parseInt(Amperes);
        var F = PowerFactor;

        var A = 0;
        var PC = 1;

        if (P == 3) {
            PC = 1.73;
        }

        A = (V * M * F * PC) / 1000
        return (A);
    }

    function computeForm2(form) {
        var P = get_PhaseRadio_value(form);
        var V = form.VoltsReq.value;
        var A = form.Amperes.value;
        var F = get_PFRadio_value(form);

        A = CalcPowerAmp(form, P, V, A, F);
        form.PowerOutput.value = A;

        return;
    }

    function get_PhaseRadio_value(form) {

        for (var i = 0; i < form.Phase.length; i++) {

            if (form.Phase[i].checked) {
                var rad_val = form.Phase[i].value;
            }
        }

        return rad_val;
    }

    function get_PFRadio_value(form) {
        for (var i = 0; i < form.PowerFactor.length; i++) {
            if (form.PowerFactor[i].checked) {
                var rad_val = form.PowerFactor[i].value;
            }
        }
        return rad_val;
    }

    function computeForm(form) {

        if ((form.volts.value == null || form.volts.value.length == 0)) {
            return;
        }

        var E = form.volts.value;
        var K = form.kva.value;
        var P = form.phase1.value;
        var A = 0;
        //alert("P is " + P);
        A = CalcKVA(form, E, K, P);
        form.Ampere.value = A;

        return;
    }

    function computeKVAtoKW(form) {
        if ((form.kvain.value == null || form.kvain.value == 0)) {
            return;
        }

        var K = form.kvain.value;
        var W = 0;

        W = K * 0.8;
        //alert(W)
        form.kwout.value = W;
        return;
    }

    function computeKWtoKVA(form) {
        if ((form.kwin.value == null || form.kwin.value == 0)) {
            //alert("Hi");
            return;
        }

        var W = form.kwin.value;
        var K = 0;

        K = W / 0.8;
        form.kvaout.value = K;
        //alert(K);
        return;
    }

    function computeKWtoHP(form) {
        if ((form.kwinHP.value == null || form.kwinHP.value == 0)) {
            return;
        }

        var W = form.kwinHP.value;
        var H = 0;

        H = W / 0.746;
        form.hpout.value = H;
        return;
    }

    function computeHPtoKVA(form) {
        if ((form.hpin.value == null || form.hpin.value == 0)) {
            return;
        }

        var H = form.hpin.value;
        var K = 0;
        var S = 1;
        var R = 1;

        if (H < 50) {
            R = 1.5;
        } else if (H > 49 && H < 100) {
            R = 1.4;
        } else if (H > 99) {
            R = 1.3;
            S = 5;
        }
        if (H < 30) {
            S = 7;
        } else if (H > 29 && H < 100) {
            S = 6
        }

        K = ((H * R * S) / 2) / 1.39;

        form.kvareq.value = K;
        return;
    }

    function getValues(form) {
        var i;

        for (i = 1; i < maxRows; i++) {
            cells[i].HP = eval("form.HP" + i + ".value");
            cells[i].SM = eval("form.SM" + i + "[0].checked");
        }
    }

    //  Counts the number of rows used (or motors)
    function countMotors() {
        var i = 1;
        var count = 0;

        while (i < maxRows && cells[i].HP != "" && cells[i].HP != 0) {
            count++;
            i++;
        }
        return count;
    }

    //  Prints an error message
    function error(emsg) {
        window.status = "## ERROR: " + emsg + " ##";
        setTimeout('clearError()', 5000);
    }

    //  Clears the status bar
    function clearError() {
        window.status = "";
    }

    function evalGenSize(form) {
        var hp;
        var phasemult = 1.39;
        var count = 0;

        getValues(form);

        count = countMotors();
        if (count == 0) {
            error("No motors entered.");
        } else {
            var rcprev = 0;
            var rcmax = 0;
            var scmax = 0;
            var kvaStart = 0;
            var kvaRunning = 0;
            var sm = 1;

            if (form.phase[1].checked) {
                phasemult = 4.20;
            } else {
                phasemult = 1.39;
            }

            for (i = 1; i <= count; i++) {
                hp = cells[i].HP;
                sm = cells[i].SM;
                if (hp < 0) {
                    error("Some HP values are negative.");
                }
                cells[i].RV = calcRV(hp);
                cells[i].PC = calcPC(hp);
                cells[i].SV = calcSV(hp, sm);
                cells[i].RC = calcRC(hp, rcprev);
                cells[i].SC = calcSC(hp, rcprev, sm);
                rcprev = cells[i].RC;
                if (rcprev > rcmax) {
                    rcmax = rcprev;
                }
                if (cells[i].SC > scmax) {
                    scmax = cells[i].SC;
                }
            }
            returnValues(form);
            kvaStart = scmax / phasemult / 2;
            kvaRunning = rcmax / phasemult;
            recommended = 1.16 * Math.max(kvaStart, kvaRunning);

            form.startwith.value = Math.round(kvaStart);
            form.runwith.value = Math.round(kvaRunning);
            form.recommend.value = Math.round(recommended);
        }
    }

    function returnValues(form) {
        var i = 1;

        if (cells[i].SC != 0) {
            form.RV1.value = cells[i].RV;
            form.PC1.value = Math.round(cells[i].PC);
            form.SV1.value = cells[i].SV;
            form.RC1.value = Math.round(cells[i].RC);
            form.SC1.value = Math.round(cells[i].SC);
        }
        i++;
        if (cells[i].SC != 0) {
            form.RV2.value = cells[i].RV;
            form.PC2.value = Math.round(cells[i].PC);
            form.SV2.value = cells[i].SV;
            form.RC2.value = Math.round(cells[i].RC);
            form.SC2.value = Math.round(cells[i].SC);
        }
        i++;
        if (cells[i].SC != 0) {
            form.RV3.value = cells[i].RV;
            form.PC3.value = Math.round(cells[i].PC);
            form.SV3.value = cells[i].SV;
            form.RC3.value = Math.round(cells[i].RC);
            form.SC3.value = Math.round(cells[i].SC);
        }
        i++;
        if (cells[i].SC != 0) {
            form.RV4.value = cells[i].RV;
            form.PC4.value = Math.round(cells[i].PC);
            form.SV4.value = cells[i].SV;
            form.RC4.value = Math.round(cells[i].RC);
            form.SC4.value = Math.round(cells[i].SC);
        }
        i++;
        if (cells[i].SC != 0) {
            form.RV5.value = cells[i].RV;
            form.PC5.value = Math.round(cells[i].PC);
            form.SV5.value = cells[i].SV;
            form.RC5.value = Math.round(cells[i].RC);
            form.SC5.value = Math.round(cells[i].SC);
        }
        i++;
        if (cells[i].SC != 0) {
            form.RV6.value = cells[i].RV;
            form.PC6.value = Math.round(cells[i].PC);
            form.SV6.value = cells[i].SV;
            form.RC6.value = Math.round(cells[i].RC);
            form.SC6.value = Math.round(cells[i].SC);
        }
        i++;
    }

    function resetAllMotors(form) {
        for (i = 1; i < maxRows; i++) {
            cells[i].HP = 0;
            cells[i].RC = 0;
            cells[i].SC = 0;
        }
        form.HP6.value = "";
        form.HP5.value = "";
        form.HP4.value = "";
        form.HP3.value = "";
        form.HP2.value = "";
        form.HP1.value = "";
    }
