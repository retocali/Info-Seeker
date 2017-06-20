#include "il2cpp-config.h"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif

#include <cstring>
#include <string.h>
#include <stdio.h>
#include <cmath>
#include <limits>
#include <assert.h>

// BasicTileScript
struct BasicTileScript_t626062147;
// MapScript
struct MapScript_t2700574681;
// UnityEngine.GameObject
struct GameObject_t1756533147;
// UnityEngine.Transform
struct Transform_t3275118058;
// System.Object
struct Il2CppObject;

#include "class-internals.h"
#include "codegen/il2cpp-codegen.h"
#include "mscorlib_System_Array3829468939.h"
#include "AssemblyU2DCSharp_U3CModuleU3E3783534214.h"
#include "AssemblyU2DCSharp_U3CModuleU3E3783534214MethodDeclarations.h"
#include "AssemblyU2DCSharp_BasicTileScript626062147.h"
#include "AssemblyU2DCSharp_BasicTileScript626062147MethodDeclarations.h"
#include "mscorlib_System_Void1841601450.h"
#include "UnityEngine_UnityEngine_MonoBehaviour1158329972MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Input1785128008MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Camera189460977MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Vector22243707579MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Physics634932869MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Debug1368543263MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Component3819376471MethodDeclarations.h"
#include "UnityEngine_UnityEngine_GameObject1756533147MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Transform3275118058MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Touch407273883.h"
#include "UnityEngine_UnityEngine_Ray2469606224.h"
#include "UnityEngine_UnityEngine_RaycastHit87180320.h"
#include "mscorlib_System_Int322071877448.h"
#include "UnityEngine_UnityEngine_Touch407273883MethodDeclarations.h"
#include "UnityEngine_UnityEngine_TouchPhase2458120420.h"
#include "UnityEngine_UnityEngine_Camera189460977.h"
#include "UnityEngine_UnityEngine_Vector22243707579.h"
#include "UnityEngine_UnityEngine_Vector32243707580.h"
#include "mscorlib_System_Boolean3825574718.h"
#include "mscorlib_System_String2029220233.h"
#include "mscorlib_System_Object2689449295.h"
#include "UnityEngine_UnityEngine_RaycastHit87180320MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Collider3497673348.h"
#include "UnityEngine_UnityEngine_GameObject1756533147.h"
#include "UnityEngine_UnityEngine_Transform3275118058.h"
#include "UnityEngine_UnityEngine_Vector32243707580MethodDeclarations.h"
#include "mscorlib_System_Single2076509932.h"
#include "AssemblyU2DCSharp_MapScript2700574681.h"
#include "AssemblyU2DCSharp_MapScript2700574681MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Random1170710517MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Quaternion4030073918MethodDeclarations.h"
#include "UnityEngine_UnityEngine_Object1021602117MethodDeclarations.h"
#include "UnityEngine_ArrayTypes.h"
#include "UnityEngine_UnityEngine_Quaternion4030073918.h"
#include "UnityEngine_UnityEngine_Object1021602117.h"

// !!0 UnityEngine.Object::Instantiate<System.Object>(!!0,UnityEngine.Vector3,UnityEngine.Quaternion,UnityEngine.Transform)
extern "C"  Il2CppObject * Object_Instantiate_TisIl2CppObject_m360069213_gshared (Il2CppObject * __this /* static, unused */, Il2CppObject * p0, Vector3_t2243707580  p1, Quaternion_t4030073918  p2, Transform_t3275118058 * p3, const MethodInfo* method);
#define Object_Instantiate_TisIl2CppObject_m360069213(__this /* static, unused */, p0, p1, p2, p3, method) ((  Il2CppObject * (*) (Il2CppObject * /* static, unused */, Il2CppObject *, Vector3_t2243707580 , Quaternion_t4030073918 , Transform_t3275118058 *, const MethodInfo*))Object_Instantiate_TisIl2CppObject_m360069213_gshared)(__this /* static, unused */, p0, p1, p2, p3, method)
// !!0 UnityEngine.Object::Instantiate<UnityEngine.GameObject>(!!0,UnityEngine.Vector3,UnityEngine.Quaternion,UnityEngine.Transform)
#define Object_Instantiate_TisGameObject_t1756533147_m351711267(__this /* static, unused */, p0, p1, p2, p3, method) ((  GameObject_t1756533147 * (*) (Il2CppObject * /* static, unused */, GameObject_t1756533147 *, Vector3_t2243707580 , Quaternion_t4030073918 , Transform_t3275118058 *, const MethodInfo*))Object_Instantiate_TisIl2CppObject_m360069213_gshared)(__this /* static, unused */, p0, p1, p2, p3, method)
#ifdef __clang__
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Winvalid-offsetof"
#pragma clang diagnostic ignored "-Wunused-variable"
#endif
// System.Void BasicTileScript::.ctor()
extern "C"  void BasicTileScript__ctor_m1064887292 (BasicTileScript_t626062147 * __this, const MethodInfo* method)
{
	{
		MonoBehaviour__ctor_m2464341955(__this, /*hidden argument*/NULL);
		return;
	}
}
// System.Void BasicTileScript::Start()
extern "C"  void BasicTileScript_Start_m2277161032 (BasicTileScript_t626062147 * __this, const MethodInfo* method)
{
	{
		return;
	}
}
// System.Void BasicTileScript::Update()
extern Il2CppClass* Input_t1785128008_il2cpp_TypeInfo_var;
extern Il2CppClass* Debug_t1368543263_il2cpp_TypeInfo_var;
extern Il2CppCodeGenString* _stringLiteral2736962493;
extern const uint32_t BasicTileScript_Update_m3255550703_MetadataUsageId;
extern "C"  void BasicTileScript_Update_m3255550703 (BasicTileScript_t626062147 * __this, const MethodInfo* method)
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_method (BasicTileScript_Update_m3255550703_MetadataUsageId);
		s_Il2CppMethodInitialized = true;
	}
	Touch_t407273883  V_0;
	memset(&V_0, 0, sizeof(V_0));
	Ray_t2469606224  V_1;
	memset(&V_1, 0, sizeof(V_1));
	Touch_t407273883  V_2;
	memset(&V_2, 0, sizeof(V_2));
	RaycastHit_t87180320  V_3;
	memset(&V_3, 0, sizeof(V_3));
	{
		IL2CPP_RUNTIME_CLASS_INIT(Input_t1785128008_il2cpp_TypeInfo_var);
		int32_t L_0 = Input_get_touchCount_m2050827666(NULL /*static, unused*/, /*hidden argument*/NULL);
		if ((((int32_t)L_0) <= ((int32_t)0)))
		{
			goto IL_007d;
		}
	}
	{
		IL2CPP_RUNTIME_CLASS_INIT(Input_t1785128008_il2cpp_TypeInfo_var);
		Touch_t407273883  L_1 = Input_GetTouch_m1463942798(NULL /*static, unused*/, 0, /*hidden argument*/NULL);
		V_0 = L_1;
		int32_t L_2 = Touch_get_phase_m196706494((&V_0), /*hidden argument*/NULL);
		if (L_2)
		{
			goto IL_007d;
		}
	}
	{
		Camera_t189460977 * L_3 = Camera_get_main_m475173995(NULL /*static, unused*/, /*hidden argument*/NULL);
		IL2CPP_RUNTIME_CLASS_INIT(Input_t1785128008_il2cpp_TypeInfo_var);
		Touch_t407273883  L_4 = Input_GetTouch_m1463942798(NULL /*static, unused*/, 0, /*hidden argument*/NULL);
		V_2 = L_4;
		Vector2_t2243707579  L_5 = Touch_get_position_m2079703643((&V_2), /*hidden argument*/NULL);
		Vector3_t2243707580  L_6 = Vector2_op_Implicit_m176791411(NULL /*static, unused*/, L_5, /*hidden argument*/NULL);
		Ray_t2469606224  L_7 = Camera_ScreenPointToRay_m614889538(L_3, L_6, /*hidden argument*/NULL);
		V_1 = L_7;
		Ray_t2469606224  L_8 = V_1;
		bool L_9 = Physics_Raycast_m2736931691(NULL /*static, unused*/, L_8, (&V_3), /*hidden argument*/NULL);
		if (!L_9)
		{
			goto IL_007d;
		}
	}
	{
		IL2CPP_RUNTIME_CLASS_INIT(Debug_t1368543263_il2cpp_TypeInfo_var);
		Debug_Log_m920475918(NULL /*static, unused*/, _stringLiteral2736962493, /*hidden argument*/NULL);
		Collider_t3497673348 * L_10 = RaycastHit_get_collider_m301198172((&V_3), /*hidden argument*/NULL);
		GameObject_t1756533147 * L_11 = Component_get_gameObject_m3105766835(L_10, /*hidden argument*/NULL);
		Transform_t3275118058 * L_12 = GameObject_get_transform_m909382139(L_11, /*hidden argument*/NULL);
		Vector3_t2243707580  L_13;
		memset(&L_13, 0, sizeof(L_13));
		Vector3__ctor_m2638739322(&L_13, (0.0f), (0.0f), (90.0f), /*hidden argument*/NULL);
		Transform_Rotate_m1743927093(L_12, L_13, /*hidden argument*/NULL);
	}

IL_007d:
	{
		return;
	}
}
// System.Void BasicTileScript::OnMouseDown()
extern "C"  void BasicTileScript_OnMouseDown_m170811996 (BasicTileScript_t626062147 * __this, const MethodInfo* method)
{
	{
		GameObject_t1756533147 * L_0 = Component_get_gameObject_m3105766835(__this, /*hidden argument*/NULL);
		Transform_t3275118058 * L_1 = GameObject_get_transform_m909382139(L_0, /*hidden argument*/NULL);
		Vector3_t2243707580  L_2;
		memset(&L_2, 0, sizeof(L_2));
		Vector3__ctor_m2638739322(&L_2, (0.0f), (0.0f), (90.0f), /*hidden argument*/NULL);
		Transform_Rotate_m1743927093(L_1, L_2, /*hidden argument*/NULL);
		return;
	}
}
// System.Void MapScript::.ctor()
extern "C"  void MapScript__ctor_m3548366692 (MapScript_t2700574681 * __this, const MethodInfo* method)
{
	{
		MonoBehaviour__ctor_m2464341955(__this, /*hidden argument*/NULL);
		return;
	}
}
// System.Void MapScript::Start()
extern Il2CppClass* Object_t1021602117_il2cpp_TypeInfo_var;
extern const MethodInfo* Object_Instantiate_TisGameObject_t1756533147_m351711267_MethodInfo_var;
extern const uint32_t MapScript_Start_m1219296372_MetadataUsageId;
extern "C"  void MapScript_Start_m1219296372 (MapScript_t2700574681 * __this, const MethodInfo* method)
{
	static bool s_Il2CppMethodInitialized;
	if (!s_Il2CppMethodInitialized)
	{
		il2cpp_codegen_initialize_method (MapScript_Start_m1219296372_MetadataUsageId);
		s_Il2CppMethodInitialized = true;
	}
	int32_t V_0 = 0;
	int32_t V_1 = 0;
	Vector2_t2243707579  V_2;
	memset(&V_2, 0, sizeof(V_2));
	{
		V_0 = 0;
		goto IL_0065;
	}

IL_0007:
	{
		V_1 = 0;
		goto IL_005a;
	}

IL_000e:
	{
		int32_t L_0 = V_0;
		int32_t L_1 = V_1;
		Vector2__ctor_m3067419446((&V_2), ((float)((float)(3.0f)*(float)(((float)((float)L_0))))), ((float)((float)(3.0f)*(float)(((float)((float)L_1))))), /*hidden argument*/NULL);
		GameObjectU5BU5D_t3057952154* L_2 = __this->get_tilesArray_2();
		GameObjectU5BU5D_t3057952154* L_3 = __this->get_tilesArray_2();
		int32_t L_4 = Random_Range_m694320887(NULL /*static, unused*/, 0, (((int32_t)((int32_t)(((Il2CppArray *)L_3)->max_length)))), /*hidden argument*/NULL);
		int32_t L_5 = L_4;
		GameObject_t1756533147 * L_6 = (L_2)->GetAtUnchecked(static_cast<il2cpp_array_size_t>(L_5));
		Vector2_t2243707579  L_7 = V_2;
		Vector3_t2243707580  L_8 = Vector2_op_Implicit_m176791411(NULL /*static, unused*/, L_7, /*hidden argument*/NULL);
		Quaternion_t4030073918  L_9 = Quaternion_get_identity_m1561886418(NULL /*static, unused*/, /*hidden argument*/NULL);
		GameObject_t1756533147 * L_10 = Component_get_gameObject_m3105766835(__this, /*hidden argument*/NULL);
		Transform_t3275118058 * L_11 = GameObject_get_transform_m909382139(L_10, /*hidden argument*/NULL);
		IL2CPP_RUNTIME_CLASS_INIT(Object_t1021602117_il2cpp_TypeInfo_var);
		Object_Instantiate_TisGameObject_t1756533147_m351711267(NULL /*static, unused*/, L_6, L_8, L_9, L_11, /*hidden argument*/Object_Instantiate_TisGameObject_t1756533147_m351711267_MethodInfo_var);
		int32_t L_12 = V_1;
		V_1 = ((int32_t)((int32_t)L_12+(int32_t)1));
	}

IL_005a:
	{
		int32_t L_13 = V_1;
		if ((((int32_t)L_13) < ((int32_t)3)))
		{
			goto IL_000e;
		}
	}
	{
		int32_t L_14 = V_0;
		V_0 = ((int32_t)((int32_t)L_14+(int32_t)1));
	}

IL_0065:
	{
		int32_t L_15 = V_0;
		if ((((int32_t)L_15) < ((int32_t)3)))
		{
			goto IL_0007;
		}
	}
	{
		return;
	}
}
// System.Void MapScript::Update()
extern "C"  void MapScript_Update_m3835513785 (MapScript_t2700574681 * __this, const MethodInfo* method)
{
	{
		return;
	}
}
#ifdef __clang__
#pragma clang diagnostic pop
#endif
