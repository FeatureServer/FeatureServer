const _ = require('lodash')
const { createMultipartRamp, createAlgorithmicRamp } = require('./colorRamps')
const createSymbol = require('./createSymbol')

module.exports = { createClassBreakInfos, createUniqueValueInfos }

const renderers = {
  classBreakInfo: require('../../templates/renderers/classBreakInfo.json'),
  uniqueValueInfo: require('../../templates/renderers/uniqueValueInfo.json'),
  algorithmicColorRamp: require('../../templates/renderers/algorithmicColorRamp.json')
}

function createClassBreakInfos (breaks, classification) {
  const type = 1 // TODO: use this to get the geometry type for creating a symbol
  const inputRamp = classification && classification.colorRamp ? classification.colorRamp : undefined
  const colorRamp = createColorRamp(breaks, inputRamp)
  let baseSymbol
  if (classification && classification.baseSymbol) baseSymbol = classification.baseSymbol

  return breaks.map((currBreak, index) => {
    const json = _.cloneDeep(renderers.classBreakInfo)
    json.classMaxValue = currBreak[1]
    json.classMinValue = currBreak[0]
    json.label = `${json.classMinValue}-${json.classMaxValue}` // TODO: handle duplicate max/min values between adjacent classes
    json.description = ''
    json.symbol = createSymbol(baseSymbol, colorRamp[index], type)
    return json
  })
}

function createUniqueValueInfos () {

}

function createColorRamp (breaks, inputRamp) {
  const rampOptions = {
    rampDetails: inputRamp || _.cloneDeep(renderers.algorithmicColorRamp),
    breakCount: breaks.length
  }
  if (rampOptions.rampDetails.type === 'multipart' && rampOptions.rampDetails.colorRamps) {
    return createMultipartRamp(rampOptions)
  } else if (rampOptions.rampDetails.type === 'algorithmic') {
    return createAlgorithmicRamp(rampOptions)
  } else {
    console.log('Incorrect color ramp type: ', rampOptions.rampDetails.type)
  }
}
