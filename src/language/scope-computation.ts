import { AstNodeDescription, DefaultScopeComputation, LangiumDocument, LangiumServices, Module, PartialLangiumServices, streamAllContents } from "langium";
import { isPrincipals } from "./generated/ast";
import { HelloWorldServices } from "./hello-world-module";

export class HelloWorldScopeComputation extends DefaultScopeComputation {
    constructor(services: LangiumServices) {
        super(services)
    }

    override async computeExports(document: LangiumDocument): Promise<AstNodeDescription[]> {
        const exportedNames: AstNodeDescription[] = []
        for (const childNode of streamAllContents(document.parseResult.value)) {
            if (isPrincipals(childNode)) {
                childNode.elements.forEach(principal => {
                    exportedNames.push(this.descriptions.createDescription(document.parseResult.value, principal.name, document))
                })
            }
        }
        return exportedNames
    }
}

export const HelloWorldModule: Module<HelloWorldServices, PartialLangiumServices> = {
    references: {
        ScopeComputation: (services) => new HelloWorldScopeComputation(services)
    }
}