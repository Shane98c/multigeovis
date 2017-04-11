export class dataSet {
  dataSetName: string
  samples: [
    {
      sampleID: number,
      analysisDepth: number,
      analysisAge: {
        "AgeOlder": number,
        "Age": number,
        "AgeYounger": number,
        "ChronologyName": string,
        "AgeType": string,
        "ChronologyID": number
      },
      sampleData: [
        {
          "TaxonName": string,
          "VariableUnits": string,
          "VariableElement": string,
          "Value": number,
          "EcolGroupID": string
        }
      ]
    }
  ]
}
