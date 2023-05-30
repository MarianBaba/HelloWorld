import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument, LangiumServices, Module, MultiMap, PartialLangiumServices, PrecomputedScopes, streamAllContents } from "langium"
import { isPrincipal } from "./generated/ast"
import { HelloWorldAddedServices, HelloWorldServices } from "./hello-world-module"
import { HelloWorldValidator } from "./hello-world-validator"

export class HelloWorldScopeComputation extends DefaultScopeComputation {
    constructor(services: LangiumServices) {
        super(services)
    }

    override async computeExports(document: LangiumDocument): Promise<AstNodeDescription[]> {
        const exportedDescriptions: AstNodeDescription[] = []
        for (const childNode in streamAllContents(document.parseResult.value)) {
            if (isPrincipal(childNode)) {
               // exporting every principal name
                exportedDescriptions.push(this.descriptions.createDescription(childNode, childNode.name))
            }
        }
        return exportedDescriptions
    }

    override async computeLocalScopes(document: LangiumDocument): Promise<PrecomputedScopes> {
        const model = document.parseResult.value
        const scopes = new MultiMap<AstNode, AstNodeDescription>()
        streamAllContents(model).filter(isPrincipal).forEach(principal => {
            scopes.add(model, this.descriptions.createDescription(principal, principal.name, document))
        })
        return scopes
    }
    
}

export const HelloWorldModule: Module<HelloWorldServices, PartialLangiumServices & HelloWorldAddedServices> = {
    validation: {
        HelloWorldValidator: HelloWorldValidator
    },
    references: {
        ScopeComputation: (services) => new HelloWorldScopeComputation(services)
    }
}