export const drugsPcrData = {

    rcpDrugs: [
        {
            name: 'Adrenalina',
            type: 'drug',
            id: 1,
            cliked: 0
        },
        {
            name: 'Amiodarona',
            type: 'drug',
            id: 2,
            cliked: 0
        },
        {
            name: 'Bic.Sódio',
            type: 'drug',
            id: 3,
            cliked: 0
        },
        {
            name: 'Cálcio',
            type: 'drug',
            id: 4,
            cliked: 0
        },
        {
            name: 'Magnésio',
            type: 'drug',
            id: 5,
            cliked: 0
        },
        {
            name: 'Lidocaína',
            type: 'drug',
            id: 6,
            cliked: 0
        },
        {
            name: 'Potássio',
            type: 'drug',
            id: 7,
            cliked: 0
        },
        {
            name: 'Volume',
            type: 'drug',
            id: 8,
            cliked: 0
        },
        {
            name: 'Trombolitico',
            type: 'drug',
            id: 9,
            cliked: 0
        }

    ],

    interventions: [
        {
            name: 'Choque.Eletric',
            id: 1,
            cliked: 0,
            hasMenu: true,
            detail: [
                {
                    name: 'Desfib.SemSinc',
                    type: 'Chock',
                },
                {
                    name: 'Cardiov.ComSinc',
                    type: 'Chock',
                }
            ],
        },
        {
            name: 'Pulso',
            hasMenu: true,
            detail: [
                {
                    name: 'Checou.Pulso',
                    type: 'pulse',
                    label: 'Estado do pulso',
                },
                {
                    name: 'N.Checou',
                    type: 'pulse',
                    label: 'Estado do pulso',
                }
            ],
            id: 2,
            cliked: 0
        },
        {
            name: 'Compressao',
            hasMenu: true,
            detail: [
                {
                    name: 'Iniciou',
                    label: 'Compressões',
                    type: 'interv',
                },
                {
                    name: 'Trocou',
                    label: 'Compressões',
                    type: 'interv',
                },
                {
                    name: 'Parou',
                    label: 'Compressões',
                    type: 'interv',
                }
            ],
            id: 3,
            cliked: 0
        },
        {
            name: 'Check.CAGADA',
            type: 'cables',
            hasMenu: false,
            id: 4,
            cliked: 0
        },
        {
            name: '5hs & 5Ts',
            type: 'interv',
            label:'Considerou Causas',
            hasMenu: false,
            id: 5,
            cliked: 0
        },
        {
            name: 'IOT',
            type: 'interv',
            hasMenu: true,
            detail: [
                {
                    name: 'NÃO.Efetiva',
                    label: 'Intubação',
                    type: 'interv',
                },
                 {
                    name: 'COM.Sucesso',
                    label: 'Intubação',
                    type: 'interv',
                },
            ],
            id: 6,
            cliked: 0
        },
        {
            name: 'Atropina',
            type: 'drug',
            hasMenu: false,
            id: 7,
            cliked: 0
        },
        {
            name: 'Outros.Procedimentos',
            type: 'drug',
            hasMenu: false,
            id: 8,
            cliked: 0
        },
        {
            name: 'N.Tirou 02',
            type: 'interv',
            hasMenu: false,
            id: 9,
            cliked: 0
        },

    ]


}