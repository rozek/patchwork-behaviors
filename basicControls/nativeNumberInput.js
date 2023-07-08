  const {
    ValueIsFiniteNumber,
    expectBoolean, expectNumber, allowFiniteNumber, expectListSatisfying,
    allowTextline
  } = SPW

  export function initialize (
    Work,Sheet,Patch, reactively,
    $,define$Property, fill$fromJSON,JSONfor$, html
  ) {
    define$Property(
      'Value',
      function () { return $._Value || 0 },
      function (newValue) {
        expectNumber('input value',newValue)
        if ($._Value !== newValue) { $._Value = newValue }
      }
    )

    define$Property(
      'Minimum',
      function () { return $._Minimum },
      function (newValue) {
        allowFiniteNumber('minimum input value',newValue)
        $._Minimum = (newValue == null ? undefined : newValue)

        if (newValue != null) {
          if ($._Value < newValue) { $._Value = newValue }
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
          if ($._Value > newValue) { $._Value = newValue }
        }
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
      if (isFinite(Value)) { $.Value = Value }
    }

    reactively(() => {
      if ($._Suggestions == null) {
        this.Render = html`<input type="number" value=${$._Value}
          min=${$._Minimum} max=${$._Maximum} placeholder=${$._Placeholder}
          readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}/>`
      } else {
        this.Render = html`<input type="number" value=${$._Value}
          min=${$._Minimum} max=${$._Maximum} placeholder=${$._Placeholder}
          readonly=${$._isReadonly}
          oninput=${handleInput} onchange=${handleInput}
          list=${this.uniqueId}/>
        <datalist id=${this.uniqueId}>
          ${$._Suggestions.map((Suggestion) => {
            return html`<option value=${Suggestion}></option>`
          })}
        </datalist>`
      }
    })
  }
