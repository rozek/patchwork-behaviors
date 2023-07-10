//namespace nativeNumberInput {
const { ValuesDiffer, ValueIsFiniteNumber, expectBoolean, expectNumber, allowFiniteNumber, expectNumberInRange, expectIntegerInRange, expectListSatisfying, allowTextline, expectTextline } = SPW;
function formatted(Value, Decimals) {
    return (Decimals === 'any'
        ? Value.toString()
        : Value.toFixed(Decimals));
}
export function initialize(Work, Sheet, Patch, installStyle, reactively, $, define$Property, fill$fromJSON, JSONfor$, html) {
    installStyle(`
      .SPW_nativeNumberInput {
        display:block; position:absolute;
        left:0px; top:0px; right:0px; bottom:0px;
      }
    `);
    $._ClassList = '';
    $._Value = 0;
    $._Minimum = undefined;
    $._Maximum = undefined;
    $._Stepping = 1;
    $._Decimals = 'any';
    $._Pattern = undefined;
    $._Placeholder = undefined;
    $._isReadonly = false;
    $._Suggestions = undefined;
    define$Property('ClassList', function () { return $._ClassList; }, function (newValue) {
        expectTextline('CSS class list', newValue);
        newValue = newValue.trim().replace(/s+/g, ' ');
        if ($._ClassList !== newValue) {
            $._ClassList = newValue;
        }
    });
    define$Property('Value', function () { return $._Value; }, function (newValue) {
        expectNumber('input value', newValue);
        if ($._Value === newValue) {
            return;
        }
        $._Value = newValue;
        if (!$._hasFocus) {
            $._ValueToShow = formatted(newValue, $._Decimals);
        }
    });
    define$Property('Minimum', function () { return $._Minimum; }, function (newValue) {
        allowFiniteNumber('minimum input value', newValue);
        if (newValue == null) {
            newValue = undefined;
        }
        if ($._Minimum === newValue) {
            return;
        }
        $._Minimum = newValue;
        if (newValue != null) {
            if ($._Value < newValue) {
                $.Value = newValue;
            }
            if (($._Maximum || Infinity) < newValue) {
                $._Maximum = newValue;
            }
        }
    });
    define$Property('Maximum', function () { return $._Maximum; }, function (newValue) {
        allowFiniteNumber('maximum input value', newValue);
        if (newValue == null) {
            newValue = undefined;
        }
        if ($._Maximum === newValue) {
            return;
        }
        $._Maximum = newValue;
        if (newValue != null) {
            if (($._Minimum || -Infinity) > newValue) {
                $._Minimum = newValue;
            }
            if ($._Value > newValue) {
                $.Value = newValue;
            }
        }
    });
    define$Property('Stepping', function () { return $._Stepping; }, function (newValue) {
        if (newValue !== 'any') {
            expectNumberInRange('input stepping', newValue, 0, Infinity, false, false);
        }
        if ($._Stepping !== newValue) {
            $._Stepping = newValue;
        }
    });
    define$Property('Decimals', function () { return $._Decimals; }, function (newValue) {
        if (newValue !== 'any') {
            expectIntegerInRange('value decimals', newValue, 0, 20);
        }
        if ($._Decimals === newValue) {
            return;
        }
        $._Decimals = newValue;
        if (newValue !== 'any') {
            $._ValueToShow = formatted($._Value, newValue);
        }
    });
    define$Property('Placeholder', function () { return $._Placeholder; }, function (newValue) {
        allowTextline('input placeholder', newValue);
        if (newValue == null) {
            newValue = undefined;
        }
        if ($._Placeholder !== newValue) {
            $._Placeholder = newValue;
        }
    });
    define$Property('isReadonly', function () { return $._isReadonly; }, function (newValue) {
        expectBoolean('read-only setting', newValue);
        if ($._isReadonly !== newValue) {
            $._isReadonly = newValue;
        }
    });
    define$Property('Suggestions', function () {
        return ($._Suggestions == null ? undefined : $._Suggestions.slice());
    }, function (newValue) {
        if (newValue == null) {
            newValue = undefined;
        }
        else {
            expectListSatisfying('list of suggestions', newValue, ValueIsFiniteNumber);
            newValue = newValue.slice();
        }
        if (ValuesDiffer($._Suggestions, newValue)) {
            $._Suggestions = newValue;
        }
    });
    define$Property('hasFocus', function () { return $._hasFocus || false; }, function (_) {
        throw new Error('ReadOnlyVariable: "hasFocus" must not be set directly');
    });
    function setFocus(newValue) {
        $._hasFocus = newValue;
        if ((newValue == false) && ($._Value !== $._ValueToShow)) {
            $._ValueToShow = formatted($._Value, $._Decimals);
        }
    }
    fill$fromJSON(JSONfor$);
    $.toJSON = function () {
        return {
            Value: $._Value, Minimum: $._Minimum, Maximum: $._Maximum,
            Placeholder: $._Placeholder, isReadonly: $._isReadonly,
            Suggestions: $._Suggestions
        };
    };
    function handleInput(Event) {
        let Value = parseFloat(Event.target.value);
        if (isFinite(Value)) {
            $.Value = Value;
        }
    }
    reactively(() => {
        if ($._Suggestions == null) {
            this.Render = html `<input type="number" class="SPW_nativeNumberInput ${$._ClassList}"
          value=${$._ValueToShow} min=${$._Minimum} max=${$._Maximum} step=${$._Stepping}
          placeholder=${$._Placeholder} readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}
          onfocus=${() => setFocus(true)} onblur=${() => setFocus(false)}/>`;
        }
        else {
            this.Render = html `<input type="number" class="SPW_nativeNumberInput ${$._ClassList}"
          value=${$._ValueToShow} min=${$._Minimum} max=${$._Maximum} step=${$._Stepping}
          placeholder=${$._Placeholder} readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}
          onfocus=${() => setFocus(true)} onblur=${() => setFocus(false)}
          list=${this.uniqueId}/>
        <datalist id=${this.uniqueId}>
          ${$._Suggestions.map((Suggestion) => {
                return html `<option value=${Suggestion}></option>`;
            })}
        </datalist>`;
        }
    });
}
//}
