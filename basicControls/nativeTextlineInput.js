  const {
    ValueIsTextline,
    expectBoolean, expectOrdinal, expectListSatisfying, allowOneOf,
    allowTextline, expectTextline
  } = SPW

  export const SPW_SpellCheckings = ['default','enabled','disabled']

  export function initialize (
    Work,Sheet,Patch, on,once,off, reactively,
    $,define$Property, fill$fromJSON,JSONfor$,
    html
  ) {
    define$Property(
      'Value',
      function () { return $._Value || '' },
      function (newValue) {
        expectTextline('input value',newValue)
        $._Value = newValue
      }
    )

    define$Property(
      'minLength',
      function () { return $._minLength || 0 },
      function (newValue) {
        expectOrdinal('minimal input length',newValue)
        $._minLength = newValue

        if ($._maxLength < newValue) { $._maxLength = newValue }
      }
    )

    define$Property(
      'maxLength',
      function () { return $._maxLength || 0 },
      function (newValue) {
        expectOrdinal('maximal input length',newValue)
        $._maxLength = newValue

        if ($._minLength > newValue) { $._minLength = newValue }
      }
    )

    define$Property(
      'Pattern',
      function ():string|undefined { return $._Pattern },
      function (newValue:string|undefined) {
        allowTextline('input pattern',newValue)
        $._Pattern = newValue
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
      'SpellChecking',
      function () { return $._SpellChecking },
      function (newValue) {
        allowOneOf('spell checking setting',newValue, SPW_SpellCheckings)
        $._SpellChecking = newValue
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
          expectListSatisfying('list of suggestions',newSuggestions, ValueIsTextline)
          $._Suggestions = newSuggestions.map((Suggestion) => Suggestion.trim())
        }
      }
    )

    fill$fromJSON(JSONfor$)

    $.toJSON = function () {
      return {
        Value:$._Value, minLength:$._minLength, maxLength:$._maxLength,
        Pattern:$._Pattern, Placeholder:$._Placeholder, isReadonly:$._isReadonly,
        SpellChecking:$._SpellChecking, Suggestions:$._Suggestions
      }
    }

    function handleInput (Event) {
      $._Value = Event.target.value
    }

    reactively(() => {
      let SpellChecking:string|undefined
      switch ($._SpellChecking) {
        case 'disabled': SpellChecking = 'false'; break
        case 'enabled':  SpellChecking = 'true';  break
      }

      if ($._Suggestions == null) {
        this.Render = html`<input type="text" value=${$._Value}
          minlength=${$._minLength} maxlength=${$._maxLength}
          pattern=${$._Pattern} placeholder=${$._Placeholder}
          readonly=${$._isReadonly} spellcheck=${SpellChecking}
          oninput=${handleInput} onchange=${handleInput}/>`
      } else {
        this.Render = html`<input type="text" value=${$._Value}
          minlength=${$._minLength} maxlength=${$._maxLength}
          pattern=${$._Pattern} placeholder=${$._Placeholder}
          readonly=${$._isReadonly} spellcheck=${SpellChecking}
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

