#pragma once

#include "il2cpp-config.h"

#ifndef _MSC_VER
# include <alloca.h>
#else
# include <malloc.h>
#endif

#include <stdint.h>
#include <assert.h>
#include <exception>

// UnityEngine.Collider
struct Collider_t3497673348;
// UnityEngine.RaycastHit
struct RaycastHit_t87180320;
struct RaycastHit_t87180320_marshaled_pinvoke;
struct RaycastHit_t87180320_marshaled_com;

#include "codegen/il2cpp-codegen.h"
#include "UnityEngine_UnityEngine_RaycastHit87180320.h"

// UnityEngine.Collider UnityEngine.RaycastHit::get_collider()
extern "C"  Collider_t3497673348 * RaycastHit_get_collider_m301198172 (RaycastHit_t87180320 * __this, const MethodInfo* method) IL2CPP_METHOD_ATTR;

// Methods for marshaling
struct RaycastHit_t87180320;
struct RaycastHit_t87180320_marshaled_pinvoke;

extern "C" void RaycastHit_t87180320_marshal_pinvoke(const RaycastHit_t87180320& unmarshaled, RaycastHit_t87180320_marshaled_pinvoke& marshaled);
extern "C" void RaycastHit_t87180320_marshal_pinvoke_back(const RaycastHit_t87180320_marshaled_pinvoke& marshaled, RaycastHit_t87180320& unmarshaled);
extern "C" void RaycastHit_t87180320_marshal_pinvoke_cleanup(RaycastHit_t87180320_marshaled_pinvoke& marshaled);

// Methods for marshaling
struct RaycastHit_t87180320;
struct RaycastHit_t87180320_marshaled_com;

extern "C" void RaycastHit_t87180320_marshal_com(const RaycastHit_t87180320& unmarshaled, RaycastHit_t87180320_marshaled_com& marshaled);
extern "C" void RaycastHit_t87180320_marshal_com_back(const RaycastHit_t87180320_marshaled_com& marshaled, RaycastHit_t87180320& unmarshaled);
extern "C" void RaycastHit_t87180320_marshal_com_cleanup(RaycastHit_t87180320_marshaled_com& marshaled);
