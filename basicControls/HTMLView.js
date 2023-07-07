//declare const SPW

//namespace HTMLView {
  const { allowText } = SPW

  export function initialize (
    Work,Sheet,Patch, reactively,
    $,define$Property, fill$fromJSON,JSONfor$, html
  ) {
    define$Property(
      'Value',
      function () { return $._Value },
      function (newValue) {
        allowText('HTMLView value',newValue)
        $._Value = newValue
      }
    )

    fill$fromJSON(JSONfor$)

    $.toJSON = function () {
      return { Value:$._Value }
    }

    reactively(() => {
      this.Render = html`<div dangerouslySetInnerHTML=${{ __html:$._Value }}></div>`
    })
  }
//}

