  const {
    ValueIsFiniteNumber,
    expectBoolean, expectNumber, allowFiniteNumber, allowNumberInRange,
    expectListSatisfying,
    allowTextline
  } = SPW

  export function initialize (
    Work,Sheet,Patch, installStyle, reactively,
    $,define$Property, fill$fromJSON,JSONfor$, html
  ) {
    define$Property(
      'Value',
      function () {
console.log('Getter',$._Value || 0)
         return $._Value || 0 },
      function (newValue) {
        expectNumber('input value',newValue)
console.log('Setter',newValue)
        if ($._Value !== newValue) {
          $._Value = newValue
          if (! $._hasFocus) { $._ValueToShow = newValue }
        }
      }
    )

    define$Property(
      'Minimum',
      function () { return $._Minimum },
      function (newValue) {
        allowFiniteNumber('minimum input value',newValue)
        $._Minimum = (newValue == null ? undefined : newValue)

        if (newValue != null) {
          if ($._Value < newValue) { $.Value = newValue }
          if (($._Maximum || Infinity) < newValue) { $._Maximum = newValue }
        }
      }
    )

    define$Property(
      'Maximum',
      function () { return $._Maximum },
      function (newValue) {
        allowFiniteNumber('maximum input value',newValue)
        $._Maximum = (newValue == null ? undefined : newValue)

        if (newValue != null) {
          if (($._Minimum || -Infinity) > newValue) { $._Minimum = newValue }
          if ($._Value > newValue) { $.Value = newValue }
        }
      }
    )

    define$Property(
      'Stepping',
      function () { return $._Stepping || 'any' },
      function (newValue) {
        if (newValue !== 'any') {
          allowNumberInRange('input stepping',newValue, 0,Infinity, false,false)
        }
        $._Stepping = newValue
      }
    )

    define$Property(
      'Placeholder',
      function () { return $._Placeholder },
      function (newValue) {
        allowTextline('input placeholder',newValue)
        $._Placeholder = newValue
      }
    )

    define$Property(
      'isReadonly',
      function () { return $._isReadonly },
      function (newValue) {
        expectBoolean('read-only setting',newValue)
        $._isReadonly = newValue
      }
    )

    define$Property(
      'Suggestions',
      function () {
        return ($._Suggestions == null ? undefined : $._Suggestions.slice())
      },
      function (newSuggestions) {
        if (newSuggestions == null) {
          $._Suggestions = undefined
        } else {
          expectListSatisfying('list of suggestions',newSuggestions, ValueIsFiniteNumber)
          $._Suggestions = newSuggestions.slice()
        }
      }
    )

    define$Property(
      'hasFocus',
      function () { return $._hasFocus || false },
      function (_) {
        throw new Error('ReadOnlyVariable: "hasFocus" must not be set directly')
      }
    )

    function setFocus (newValue) {
      $._hasFocus = newValue
      if ((newValue == false) && ($._Value !== $._ValueToShow)) {
console.log('lost focus, showing now',$._Value)
        $._ValueToShow = $._Value
      }
    }

    fill$fromJSON(JSONfor$)

    $.toJSON = function () {
      return {
        Value:$._Value, Minimum:$._Minimum, Maximum:$._Maximum,
        Placeholder:$._Placeholder, isReadonly:$._isReadonly,
        Suggestions:$._Suggestions
      }
    }

    function handleInput (Event) {
      let Value = parseFloat(Event.target.value)
console.log('input number',Value,Event.type)
      if (isFinite(Value)) {
console.log('setting $.Value to',Value)
         $.Value = Value
console.log('$.Value is now',$.Value)
       }
    }

    reactively(() => {
      if ($._Suggestions == null) {
        this.Render = html`<input type="number" value=${$._ValueToShow}
          min=${$._Minimum} max=${$._Maximum} step=${$._Stepping}
          placeholder=${$._Placeholder} readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}
          onfocus=${() => setFocus(true)} onblur=${() => setFocus(false)}/>`
      } else {
        this.Render = html`<input type="number" value=${$._ValueToShow}
          min=${$._Minimum} max=${$._Maximum} step=${$._Stepping}
          placeholder=${$._Placeholder} readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}
          onfocus=${() => setFocus(true)} onblur=${() => setFocus(false)}
          list=${this.uniqueId}/>
        <datalist id=${this.uniqueId}>
          ${$._Suggestions.map((Suggestion) => {
            return html`<option value=${Suggestion}></option>`
          })}
        </datalist>`
      }
    })
  }

