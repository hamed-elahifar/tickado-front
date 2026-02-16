type multipleOpt = {
    title: string | null,
    score: string | number | null,
    file: string | null,
    isRequired: boolean,
    isLuckRandom: boolean,
    isHide: boolean,
    isExtra: boolean
}

function createDefaultOption(): multipleOpt {
    return {
        title: null,
        score: null,
        file: null,
        isRequired: false,
        isLuckRandom: false,
        isHide: false,
        isExtra: false
    }
}

type Label = {
    title: string,
    id: string
}


export const useMultipleChoice = defineStore('multiple-choice', {
    state() {
        return {
            multipleOption: createDefaultOption(),
            options: [createDefaultOption()] as multipleOpt[],
            label: [] as Label[],
            createdOptions: [] as multipleOpt[]
        }
    },
    actions: {
        addOption() {
            this.options.push(createDefaultOption());
            this.handleLabel()
        },
        hideOption(index:number) {
            if(this.options[index]) 
                this.options[index].isHide = !this.options[index].isHide;
        },
        removeOption(index:number) {
            if(this.options[index])
                this.options = this.options.filter((item, i) => i !== index);
            this.handleLabel()
        },
        handleRequirement(index:number) {
            if(this.options[index])
                this.options[index].isRequired = !this.options[index].isRequired;
        },
        handleLuckRandom(index:number) {
            if(this.options[index])
                this.options[index].isLuckRandom = !this.options[index].isLuckRandom;
        },
        updateSourceFile(index:number, files:File[]) {
            if(files[0] && this.options[index]) {
                this.options[index].file = URL.createObjectURL(files[0])
            }
        },
        handleLabel() {
            this.label = []
            this.options.forEach(item => {
                this.label.push({title: '', id: ''})
            })
        },
        handleExtraOptions(title:string, checked:boolean) {
            console.log(checked);
            if(checked) {
                this.options.push({
                    title,
                    score: '',
                    file: '',
                    isRequired: false,
                    isLuckRandom: false,
                    isHide: false,
                    isExtra: true
                })
            }
            else {
                this.options = this.options.filter(item => item.title !== title);
            }
        }
    }
})
