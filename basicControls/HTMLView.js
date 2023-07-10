  const { expectText, expectTextline } = SPW

  export function initialize (
    Work,Sheet,Patch, installStyle, reactively,
    $,define$Property, fill$fromJSON,JSONfor$, html
  ) {
    installStyle(`
      .SPW_HTMLView {
        display:block; position:absolute;
        left:0px; top:0px; right:0px; bottom:0px;
      }
    `)

    $._ClassList = ''
    $._Value     = ''

    define$Property(
      'ClassList',
      function () { return $._ClassList },
      function (newValue) {
        expectTextline('CSS class list',newValue)
          newValue = newValue.trim().replace(/s+/g,' ')
        if ($._ClassList !== newValue) { $._ClassList = newValue }
      }
    )

    define$Property(
      'Value',
      function () { return $._Value },
      function (newValue) {
        expectText('HTMLView value',newValue)
        if ($._Value !== newValue) { $._Value = newValue }
      }
    )

    fill$fromJSON(JSONfor$)

    $.toJSON = function () {
      return { Value:$._Value }
    }

    reactively(() => {
      this.Render = html`<div class="SPW_HTMLView ${$._ClassList}"
        dangerouslySetInnerHTML=${{ __html:$._Value }}></div>`
    })
  }
