export default {
  generateVCF (data) {
    // create an empty document
    const doc = document.implementation.createDocument('', '', null)

    // create root element
    const vcfRoot = doc.createElement('vcfroot')
    vcfRoot.setAttribute('Description', data.description ?? '')
    vcfRoot.setAttribute('Author', data.author ?? '')

    doc.appendChild(vcfRoot)

    // extras
    const extras = doc.createElement('EOVERRIDE')

    data.extras.forEach((extra) => {
      const e = doc.createElement(`Extra${extra.id}`)
      e.setAttribute('IsElsControlled', extra.enabled)

      if (extra.allowEnv) {
        e.setAttribute('AllowEnvLight', extra.allowEnv)

        if (extra.color) {
          e.setAttribute('Color', extra.color)
        }
      }

      extras.appendChild(e)
    })

    vcfRoot.appendChild(extras)

    // statics
    const statics = doc.createElement('STATIC')

    data.statics.forEach((stat) => {
      const s = doc.createElement(`Extra${stat.extra}`)
      s.setAttribute('Name', stat.name ?? `Extra ${stat.extra}`)

      statics.appendChild(s)
    })

    vcfRoot.appendChild(statics)

    // sounds
    const sounds = doc.createElement('SOUNDS')

    data.sounds.forEach((option) => {
      const o = doc.createElement(option.name)
      o.setAttribute('AllowUse', option.allowUse)

      if (option.allowUse && option.audioString) {
        o.setAttribute('AudioString', option.audioString)
      }

      if (option.allowUse && data.useServerSirens && option.soundSet) {
        o.setAttribute('SoundSet', option.soundSet)
      }

      sounds.appendChild(o)
    })

    vcfRoot.appendChild(sounds)

    // patterns
    const patterns = doc.createElement('PATTERN')

    data.patterns.forEach((pattern) => {
      const p = doc.createElement(pattern.name)
      p.setAttribute('IsEmergency', pattern.isEmergency)

      const flashes = data.flashes.filter(flash => flash.pattern === pattern.name)

      flashes.forEach((flash) => {
        const f = doc.createElement('Flash')

        if (flash.duration) {
          f.setAttribute('Duration', flash.duration)
        }

        if (flash.extras.length) {
          f.setAttribute('Extras', [...flash.extras].sort().join(','))
        }

        p.appendChild(f)
      })

      patterns.appendChild(p)
    })

    vcfRoot.appendChild(patterns)

    // return the document
    return doc
  }
}
