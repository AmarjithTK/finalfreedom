allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}

subprojects {
    afterEvaluate {
        try {
            val androidExt = extensions.findByName("android")
            if (androidExt != null) {
                val clazz = androidExt.javaClass
                val getNamespace = clazz.methods.find { it.name == "getNamespace" && it.parameterCount == 0 }
                val setNamespace = clazz.methods.find { it.name == "setNamespace" && it.parameterCount == 1 }
                
                val setCompileSdk = clazz.methods.find { it.name == "setCompileSdkVersion" && it.parameterTypes.size == 1 && it.parameterTypes[0] == Int::class.java }
                val setCompileSdkStr = clazz.methods.find { it.name == "setCompileSdkVersion" && it.parameterTypes.size == 1 && it.parameterTypes[0] == String::class.java }
                
                if (setCompileSdk != null) {
                    setCompileSdk.invoke(androidExt, 34)
                } else if (setCompileSdkStr != null) {
                    setCompileSdkStr.invoke(androidExt, "android-34")
                }

                if (getNamespace != null && setNamespace != null) {
                    val currentNamespace = getNamespace.invoke(androidExt)
                    if (currentNamespace == null) {
                        setNamespace.invoke(androidExt, project.group.toString())
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore
        }
    }
}

subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
